import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mammoth from "mammoth";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  if (!searchParams.get("key")) {
    return Response.json({ error: "Invalid Request Body" });
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
    Key: searchParams.get("key"),
  });

  try {
    const response = await s3Client.send(command);

    // Read the response body as a stream and convert it to a buffer
    const streamToBuffer = async (stream: any) => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    };

    const buffer: any = await streamToBuffer(response.Body);

    // Process the buffer with mammoth
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    return Response.json(text);
  } catch (error) {
    return Response.json({ error });
  }
}
