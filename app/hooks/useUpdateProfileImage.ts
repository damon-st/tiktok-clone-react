import { database } from "@/libs/AppWriteClient";

const userUpdateProfileImage = async (id: string, image: string) => {
  try {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE!,
      id,
      {
        image,
      }
    );
  } catch (error) {
    throw error;
  }
};

export default userUpdateProfileImage;
