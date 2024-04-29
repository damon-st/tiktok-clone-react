import { database, Query } from "@/libs/AppWriteClient";

const userGetRandomUsers = async () => {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE!,
      [Query.limit(5)]
    );

    const documents = response.documents;
    const objPromise = documents.map((profile) => {
      return {
        id: profile.user_id,
        name: profile.name,
        image: profile.image,
      };
    });
    return objPromise;
  } catch (error) {
    throw error;
  }
};

export default userGetRandomUsers;
