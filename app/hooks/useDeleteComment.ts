import { database } from "@/libs/AppWriteClient";

const userDeleteComment = async (id: string) => {
  try {
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT!,
      id
    );
  } catch (error) {
    throw error;
  }
};

export default userDeleteComment;
