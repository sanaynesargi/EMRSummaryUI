import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mammoth from "mammoth";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "../../../orm/database";
import { SUMMARY_PROMPT } from "../../../../utils/workingPrompt";
import { getGPTResponse } from "../../../../utils/getGPTResponse";
import { getClaudeResponse } from "../../../../utils/getClaudeResponse";

const getPatientSummaryReport = async (patientDataBlob: string) => {
  const userMessage = `Your document is ${patientDataBlob}.`;

  //return await getGPTResponse(SUMMARY_PROMPT + " " + userMessage);
  return await getClaudeResponse("hi!" + " " + userMessage);
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const clientId = searchParams.get("clientId");

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

    const summary = await getPatientSummaryReport(text);

    return Response.json({ data: summary });
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
