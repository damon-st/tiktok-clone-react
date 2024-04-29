import { database, Query } from "@/libs/AppWriteClient";
import userGetProfileByUserId from "./userGetProfileByUserId";
import { CommentWithProfile } from "../types";

const userGetCommentsByPostId = async (postId: string) => {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT!,
      [Query.equal("post_id", postId), Query.orderDesc("$id")]
    );

    const objsPromis = response.documents.map(async (comment) => {
      const profile = await userGetProfileByUserId(comment.user_id);
      return <CommentWithProfile>{
        id: comment.$id,
        user_id: comment.user_id,
        post_id: comment.post_id,
        text: comment.text,
        created_at: comment.created_at,
        profile: {
          user_id: profile.user_id,
          name: profile.name,
          image: profile.image,
        },
      };
    });
    return await Promise.all(objsPromis);
  } catch (error) {
    throw error;
  }
};

export default userGetCommentsByPostId;
