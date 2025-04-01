import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getPresignedUrl = async (objectKey: string) => {
  const S3_BUCKET = process.env.BUCKET;

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: objectKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });
  return url;
};
