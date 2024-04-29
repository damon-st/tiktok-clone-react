import { storage, database, ID } from "@/libs/AppWriteClient";

const userCreatePost = async (file: File, userId: string, caption: string) => {
  try {
    const videoID = Math.random().toString(36).slice(2, 22);
    await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_POST!,
      ID.unique(),
      {
        user_id: userId,
        text: caption,
        video_url: videoID,
        created_at: new Date().toISOString(),
      }
    );

    await storage.createFile(process.env.NEXT_PUBLIC_BUCKED_ID!, videoID, file);
  } catch (error) {
    throw error;
  }
};

export default userCreatePost;
