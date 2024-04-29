import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { CommentWithProfile } from "../types";
import userGetCommentsByPostId from "../hooks/useGetCommentsByPostId";

interface CommentStore {
  commentsByPost: CommentWithProfile[];
  setCommentsByPost: (postId: string) => void;
}

export const useCommentStore = create<CommentStore>()(
  devtools(
    persist(
      (set) => ({
        commentsByPost: [],
        setCommentsByPost: async (postId) => {
          const result = await userGetCommentsByPostId(postId);
          set({ commentsByPost: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
