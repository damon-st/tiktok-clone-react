"use client";
import ClientOnly from "@/app/components/ClientOnly";
import Comments from "@/app/components/post/Comments";
import CommentsHeader from "@/app/components/post/CommentsHeader";
import userCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import { useCommentStore } from "@/app/stores/comment";
import { useLikeStore } from "@/app/stores/like";
import { usePostStore } from "@/app/stores/post";
import { type PostPageTypes } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export default function PostPage({ params }: PostPageTypes) {
  const { postById, postsByUser, setPostById, setPostByUser } = usePostStore();
  const { setLikesByPost } = useLikeStore();
  const { setCommentsByPost } = useCommentStore();
  const router = useRouter();

  useEffect(() => {
    setPostById(params.postId);
    setCommentsByPost(params.postId);
    setLikesByPost(params.postId);
    setPostByUser(params.userId);
  }, [params.postId, params.userId]);

  const loopThroughPostsUp = () => {
    postsByUser.forEach((post) => {
      if (post.id > params.postId) {
        router.push(`/${post}/${post.id}/${params.userId}`);
      }
    });
  };
  const loopThroughPostsDown = () => {
    postsByUser.forEach((post) => {
      if (post.id < params.postId) {
        router.push(`/${post}/${post.id}/${params.userId}`);
      }
    });
  };

  return (
    <>
      <div
        className="lg:flex justify-between w-full h-screen bg-black overflow-auto"
        id="PostPage"
      >
        <div className="lg:w-[calc(100%-540px)] h-full relative">
          <Link
            href={`/profile/${params.userId}`}
            className="absolute text-white z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
          >
            <AiOutlineClose size={27} />
          </Link>
          <div>
            <button
              className="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
              onClick={loopThroughPostsUp}
            >
              <BiChevronUp color="#ffffff" size={30} />
            </button>
            <button
              className="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
              onClick={loopThroughPostsDown}
            >
              <BiChevronDown color="#ffffff" size={30} />
            </button>
          </div>
          <picture>
            <img
              loading="lazy"
              className="absolute z-20 top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
              src="/images/tiktok-logo-small.png"
              width={45}
              alt="img"
            />
          </picture>
          <ClientOnly>
            {postById?.video_url ? (
              <video
                className="fixed object-cover w-full my-auto z-[0] h-screen"
                src={userCreateBucketUrl(postById.video_url)}
              />
            ) : null}
            <div className="bg-black bg-opacity-70 lg:min-w-[480px] z-10 relative">
              {postById?.video_url ? (
                <video
                  autoPlay
                  controls
                  loop
                  muted
                  className="h-screen mx-auto"
                  src={userCreateBucketUrl(postById?.video_url)}
                />
              ) : null}
            </div>
          </ClientOnly>
        </div>
        <div
          id="InfoSection"
          className="lg:max-w-[550px] relative w-full h-full bg-white"
        >
          <div className="py-7" />
          <ClientOnly>
            {postById?.video_url ? (
              <CommentsHeader post={postById} params={params} />
            ) : null}
          </ClientOnly>
          <Comments params={params} />
        </div>
      </div>
    </>
  );
}
