import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { Like } from "../types";
import userGetLikesByPostId from "../hooks/useGetLikesByPostId";

interface LikeStore {
  likesByPost: Like[];
  setLikesByPost: (postId: string) => void;
}

export const useLikeStore = create<LikeStore>()(
  devtools(
    persist(
      (set) => ({
        likesByPost: [],
        setLikesByPost: async (postId) => {
          const result = await userGetLikesByPostId(postId);
          set({ likesByPost: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
