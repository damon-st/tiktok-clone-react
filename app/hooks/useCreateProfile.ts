import { database, ID } from "@/libs/AppWriteClient";

const userCreateProfile = async (
  userId: string,
  name: string,
  image: string,
  bio: string
): Promise<void> => {
  try {
    await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE!,
      ID.unique(),
      {
        user_id: userId,
        name,
        image,
        bio,
      }
    );
  } catch (error) {
    throw error;
  }
};

export default userCreateProfile;
