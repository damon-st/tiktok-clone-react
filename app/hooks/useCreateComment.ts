import { database, ID } from "@/libs/AppWriteClient";

const userCreateComment = async (
  userId: string,
  postId: string,
  comment: string
) => {
  try {
    await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT!,
      ID.unique(),
      {
        user_id: userId,
        post_id: postId,
        text: comment,
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    throw error;
  }
};

export default userCreateComment;
