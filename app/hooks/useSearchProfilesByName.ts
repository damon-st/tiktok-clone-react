import { database, Query } from "@/libs/AppWriteClient";

const userSearchProfilesByName = async (name: string) => {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE!,
      [Query.limit(5), Query.search("name", name)]
    );
    return response.documents.map((profile) => {
      return {
        id: profile.user_id,
        name: profile.name,
        image: profile.image,
      };
    });
  } catch (error) {
    throw error;
  }
};

export default userSearchProfilesByName;
