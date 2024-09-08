import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mammoth from "mammoth";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../orm/database";
import { SUMMARY_PROMPT } from "../../../../utils/workingPrompt";
import { getGPTResponse } from "../../../../utils/getGPTResponse";
import { getClaudeResponse } from "../../../../utils/getClaudeResponse";
import { splitMarkdownByHeadings } from "../../../../utils/splitMarkdownByHeadings";
import { countTokens } from "@anthropic-ai/tokenizer";
import { md5 } from "js-md5";

const getPatientSummaryReport = async (
  patientDataBlob: string,
  customPrompt?: string
) => {
  const userMessage = `Your document is ${patientDataBlob}.`;
  const addedPrompt = customPrompt ? customPrompt : SUMMARY_PROMPT;

  //   return await getGPTResponse(SUMMARY_PROMPT + " " + userMessage);
  const finalPrompt = addedPrompt + " " + userMessage;
  const finalPromptTokens = countTokens(finalPrompt);
  const isLargeMessage = finalPromptTokens > 9000;

  console.log("(Calculated) Tokens: " + finalPromptTokens);
  console.log("isLargeMessage: " + isLargeMessage);
  console.log("\n\n");
  const AIResp = await getClaudeResponse(finalPrompt); //isLargeMessage

  return { isLargeMessage, summary: AIResp, tokenCount: finalPromptTokens };
};

export async function POST(req: NextRequest) {
  const searchParams = await req.json();
  const clientId = searchParams.clientId;
  const userPrompt = searchParams.workingPrompt; // TODO: REMOVE WHEN FEATURE IS REMOVED (POTENTIAL SECURITY VUNERABILITY)

  if (!clientId) {
    return NextResponse.json(
      { error: "Invalid Request Body" },
      { status: 400 }
    );
  }

  // make sure client id exists
  const s3Key = await db
    .selectFrom("record_store")
    .select("record_store.s3_url")
    .where("record_store.person_id", "=", parseInt(clientId))
    .executeTakeFirst();

  if (!s3Key) {
    return NextResponse.json({ error: "Invalid Client Id" }, { status: 400 });
  }

  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: "patientdatablobs",
    Key: s3Key.s3_url,
  });

  try {
    const response = await s3Client.send(command);

    // Read the response body as a stream and convert it to a buffer
    const streamToBuffer = async (stream: any) => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    };

    const buffer: any = await streamToBuffer(response.Body);

    // Process the buffer with mammoth
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    // generate summary hash
    // const hash = md5(text);

    // check if hash stored in persistense db
    // const cachedSummaryResult = await db
    //   .selectFrom("clientpersistense")
    //   .select("clientpersistense.summary")
    //   .where("clientpersistense.hash", "=", hash)
    //   .executeTakeFirst();

    const cachedSummary = ""; //cachedSummaryResult?.summary;

    try {
      let isLargeMessage: boolean;
      let dbCached: boolean;
      let summary: string;
      let tokenCount: number;

      if (!cachedSummary) {
        const summaryReport = await getPatientSummaryReport(text, userPrompt);
        isLargeMessage = summaryReport.isLargeMessage;
        summary = summaryReport.summary;
        tokenCount = summaryReport.tokenCount;
        dbCached = false;
      } else {
        isLargeMessage = false;
        dbCached = true;
        tokenCount = 0;
        summary = cachedSummary;
      }

      const splitSummary = splitMarkdownByHeadings(summary);

      //   if (!cachedSummary) {
      //     // cache the summary in the database
      //     const result = await db
      //       .insertInto("clientpersistense")
      //       .values({ hash, summary, patient_id: clientId })
      //       .returning(["clientpersistense.hash"])
      //       .executeTakeFirst();

      //     console.log(
      //       `Cached Patient Id: ${clientId} into DB row hash: ${result.hash}\n`
      //     );
      //   } else {
      //     console.log(`Retreied Patient Id: ${clientId} from DB cache`);
      //   }

      return Response.json({
        data: splitSummary,
        model: dbCached ? "Cached DB" : !isLargeMessage ? "Haiku" : "Sonnet",
        tokenCount,
      });
    } catch (e) {
      console.log(e);
      return Response.json({ error: "LLM Retreival Error" });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
