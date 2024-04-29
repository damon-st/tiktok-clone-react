import { database, storage } from "@/libs/AppWriteClient";
import userGetLikesByPostId from "./useGetLikesByPostId";
import userDeleteLike from "./useDeleteLike";
import userGetCommentsByPostId from "./useGetCommentsByPostId";
import userDeleteComment from "./useDeleteComment";

const userDeletePost = async (postId: string, currentVideo: string) => {
  try {
    const likes = await userGetLikesByPostId(postId);
    for (const iterator of likes) {
      await userDeleteLike(iterator.id);
    }
    const comments = await userGetCommentsByPostId(postId);
    for (const iterator of comments) {
      await userDeleteComment(iterator.id);
    }
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_POST!,
      postId
    );

    await storage.deleteFile(process.env.NEXT_PUBLIC_BUCKED_ID!, currentVideo);
  } catch (error) {
    throw error;
  }
};

export default userDeletePost;
