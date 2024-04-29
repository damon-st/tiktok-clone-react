const userCreateBucketUrl = (fileId: string) => {
  const url = process.env.NEXT_PUBLIC_APPWRITE_URL!;
  const id = process.env.NEXT_PUBLIC_BUCKED_ID!;
  const endPoint = process.env.NEXT_PUBLIC_ENDPOINT!;
  if (!url || !id || !endPoint || !fileId) return "";

  return `${url}/storage/buckets/${id}/files/${fileId}/view?project=${endPoint}`;
};

export default userCreateBucketUrl;
