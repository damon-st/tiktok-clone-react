import { database, Query } from "@/libs/AppWriteClient";
import userGetProfileByUserId from "./userGetProfileByUserId";
import { PostWithProfile } from "../types";

const userGetPostById = async (id: string) => {
  try {
    const doc = await database.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_POST!,
      id
    );

    const profile = await userGetProfileByUserId(doc.user_id);
    return <PostWithProfile>{
      id: doc.$id,
      user_id: doc.user_id,
      video_url: doc.video_url,
      text: doc.text,
      created_at: doc.created_at,
      profile: {
        user_id: profile.user_id,
        name: profile.name,
        image: profile.image,
      },
    };
  } catch (error) {
    throw error;
  }
};

export default userGetPostById;
