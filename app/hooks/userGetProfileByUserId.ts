import { database, Query } from "@/libs/AppWriteClient";
import { User } from "../types";

const userGetProfileByUserId = async (userId: string): Promise<User> => {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE!,
      [Query.equal("user_id", userId)]
    );

    const documents = response.documents;

    return {
      bio: documents[0]?.bio,
      image: documents[0]?.image,
      id: documents[0]?.$id,
      name: documents[0]?.name,
      user_id: documents[0]?.user_id,
    };
  } catch (error) {
    throw error;
  }
};

export default userGetProfileByUserId;
