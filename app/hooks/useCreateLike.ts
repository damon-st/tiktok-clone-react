import { database, ID } from "@/libs/AppWriteClient";

const userCreateLike = async (userId: string, postId: string) => {
  try {
    await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE!,
      ID.unique(),
      {
        user_id: userId,
        post_id: postId,
      }
    );
  } catch (error) {
    throw error;
  }
};

export default userCreateLike;
