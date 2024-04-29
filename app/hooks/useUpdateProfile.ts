import { database, Query } from "@/libs/AppWriteClient";

const userUpdateProfile = async (id: string, name: string, bio: string) => {
  try {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE!,
      id,
      {
        name: name,
        bio: bio,
      }
    );
  } catch (error) {
    throw error;
  }
};

export default userUpdateProfile;
