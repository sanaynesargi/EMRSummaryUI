import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mammoth from "mammoth";

export async function GET() {
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: "patientdatablobs",
    Key: "DUMMY PATIENT 3.docx",
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

    console.log(text); // Do something with the extracted text

    return Response.json(text);
  } catch (error) {
    console.error("Error fetching or processing the file:", error);
    throw error;
  }
}
