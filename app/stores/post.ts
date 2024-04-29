import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { Post, PostWithProfile, Profile } from "../types";
import userGetAllPosts from "../hooks/useGetAllPosts";
import userGetPostsByUser from "../hooks/useGetPostsByUser";
import userGetPostById from "../hooks/useGetPostById";

interface PostStore {
  allPosts: PostWithProfile[];
  postsByUser: Post[];
  postById: PostWithProfile | null;
  setAllPosts: () => void;
  setPostByUser: (userId: string) => void;
  setPostById: (postId: string) => void;
}

export const usePostStore = create<PostStore>()(
  devtools(
    persist(
      (set) => ({
        allPosts: [],
        postsByUser: [],
        postById: null,
        setAllPosts: async () => {
          const result = await userGetAllPosts();
          set({ allPosts: result });
        },
        setPostByUser: async (userId) => {
          const result = await userGetPostsByUser(userId);
          set({ postsByUser: result });
        },
        setPostById: async (postId) => {
          const result = await userGetPostById(postId);
          set({ postById: result });
        },
      }),
      {
        name: "store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
