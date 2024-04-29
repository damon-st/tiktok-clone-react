import { database, Query } from "@/libs/AppWriteClient";

const userGetPostsByUser = async (userId: string) => {
  try {
    const docs = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_POST!,
      [Query.equal("user_id", userId), Query.orderDesc("$id")]
    );
    return docs.documents.map((doc) => {
      return {
        id: doc.$id,
        user_id: doc.user_id,
        video_url: doc.video_url,
        text: doc.text,
        created_at: doc.created_at,
      };
    });
  } catch (error) {
    throw error;
  }
};

export default userGetPostsByUser;
