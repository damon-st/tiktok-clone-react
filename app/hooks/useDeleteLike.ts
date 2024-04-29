import { database } from "@/libs/AppWriteClient";

const userDeleteLike = async (id: string) => {
  try {
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE!,
      id
    );
  } catch (error) {
    throw error;
  }
};

export default userDeleteLike;
