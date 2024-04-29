import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { Profile } from "../types";
import userGetProfileByUserId from "../hooks/userGetProfileByUserId";

interface ProfileStorage {
  currentProfile: Profile | null;
  setCurrentProfile: (userId: string) => void;
}

export const useProfileStore = create<ProfileStorage>()(
  devtools(
    persist(
      (set) => ({
        currentProfile: null,
        setCurrentProfile: async (userId: string) => {
          const result = await userGetProfileByUserId(userId);
          set({ currentProfile: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
