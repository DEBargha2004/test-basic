export const getImageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}${path}`;
