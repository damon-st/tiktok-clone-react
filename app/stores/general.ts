import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { RandomUsers } from "../types";
import userGetRandomUsers from "../hooks/useGetRandomUsers";

interface GeneralStore {
  isLoginOpen: boolean;
  isEditProfileOpen: boolean;
  randomUser: RandomUsers[];
  setIsLoginOpen: (val: boolean) => void;
  setIsEditProfileOpen: (val: boolean) => void;
  setRandomUsers: () => void;
}

export const useGeneralStore = create<GeneralStore>()(
  devtools(
    persist(
      (set) => ({
        isLoginOpen: false,
        isEditProfileOpen: false,
        randomUser: [],
        setIsLoginOpen: (val: boolean) => set({ isLoginOpen: val }),
        setIsEditProfileOpen: (val: boolean) => set({ isEditProfileOpen: val }),
        setRandomUsers: async () => {
          const result = await userGetRandomUsers();
          set({ randomUser: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
