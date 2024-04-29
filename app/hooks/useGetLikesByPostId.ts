import { database, Query } from "@/libs/AppWriteClient";
import { Like } from "../types";

const userGetLikesByPostId = async (postId: string) => {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE!,
      [Query.equal("post_id", postId)]
    );

    return response.documents.map((doc) => {
      return <Like>{
        id: doc.$id,
        user_id: doc.user_id,
        post_id: doc.post_id,
      };
    });
  } catch (error) {
    throw error;
  }
};

export default userGetLikesByPostId;
