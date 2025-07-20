"use server";

import { nanoid } from "nanoid";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-south-1",
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

export async function getPresignedUrlForAvatar() {
  const id = nanoid();
  const path = `/avatars/${id}.webp`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: path,
    ContentType: "image/webp",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 120 });

  return { url, path };
}

export async function getPresignedUrlForTestThumbnail() {
  const id = nanoid();
  const path = `/test/thumbnails/${id}.webp`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: path,
    ContentType: "image/webp",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 120 });

  return { url, path };
}
