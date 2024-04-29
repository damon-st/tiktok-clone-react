"use client";

import { type CommentsHeaderCompTypes } from "@/app/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { BsChatDots, BsTrash3 } from "react-icons/bs";
import { ImMusic } from "react-icons/im";
import ClientOnly from "../ClientOnly";
import { AiFillHeart } from "react-icons/ai";
import { useLikeStore } from "@/app/stores/like";
import { useCommentStore } from "@/app/stores/comment";
import { useGeneralStore } from "@/app/stores/general";
import { useUser } from "@/app/context/user";
import userIsLiked from "@/app/hooks/useIsLiked";
import userCreateLike from "@/app/hooks/useCreateLike";
import userDeleteLike from "@/app/hooks/useDeleteLike";
import userDeletePost from "@/app/hooks/useDeletePost";
import userCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import moment from "moment";

export default function CommentsHeader({
  post,
  params,
}: CommentsHeaderCompTypes) {
  const contextUser = useUser();
  const { setLikesByPost, likesByPost } = useLikeStore();
  const { setCommentsByPost, commentsByPost } = useCommentStore();
  const { setIsLoginOpen } = useGeneralStore();
  const router = useRouter();
  const [hasClickedLike, setHasClickedLike] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    setCommentsByPost(params.postId);
    setLikesByPost(params.postId);
  }, [params.postId]);

  useEffect(() => {
    hasUserLikedPost();
  }, [likesByPost]);

  const hasUserLikedPost = () => {
    if (likesByPost.length < 1 || !contextUser?.user?.id) {
      setUserLiked(false);
      return;
    }

    let res = userIsLiked(contextUser.user.id, params.postId, likesByPost);
    setUserLiked(!!res);
  };

  const like = async () => {
    try {
      setHasClickedLike(true);
      await userCreateLike(contextUser?.user?.id ?? "", params.postId);
      setLikesByPost(params.postId);
      setHasClickedLike(false);
    } catch (error) {
      setHasClickedLike(false);
      console.log(error);
      alert(error);
    }
  };

  const unLike = async (id: string) => {
    try {
      setHasClickedLike(true);
      await userDeleteLike(id);
      setLikesByPost(params.postId);
      setHasClickedLike(false);
    } catch (error) {
      setHasClickedLike(false);
      console.log(error);
      alert(error);
    }
  };
  const likeOrUnLike = async () => {
    if (!contextUser?.user) return setIsLoginOpen(true);
    let res = userIsLiked(contextUser.user.id, params.postId, likesByPost);

    if (!res) {
      like();
    } else {
      likesByPost.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser.user.id == like.user_id &&
          like.post_id == params.postId
        ) {
          unLike(like.id);
        }
      });
    }
  };

  const deletePost = async () => {
    let res = await confirm("Are you sure you want to delete this post?");
    if (!res) return;
    setIsDeleting(true);
    try {
      await userDeletePost(params.postId, post.video_url);
      router.push(`/profile/${params.userId}`);
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
      alert(error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center">
          <Link href={`/profile/${post.user_id}`}>
            {post.profile.image ? (
              <picture>
                <img
                  className="rounded-full lg:mx-0 inset-x-auto"
                  width={40}
                  src={userCreateBucketUrl(post.profile.image)}
                  alt="profile"
                />
              </picture>
            ) : (
              <div className="size-[40px] bg-gray-200 rounded-full"></div>
            )}
          </Link>
          <div className="ml-3 pt-0.5">
            <Link
              href={`/profile/${post.user_id}`}
              className="relative z-10 text-[17px] font-semibold hover:underline"
            >
              {post.profile.name}
            </Link>
            <div className="relative z-0 text-[13px] -mt-5 font-light">
              {post.profile.name}
              <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5">
                .
              </span>
              <span className="font-medium">
                {moment(post.created_at).calendar()}
              </span>
            </div>
          </div>
        </div>
        {contextUser?.user?.id === post.user_id ? (
          <div>
            {isDeleting ? (
              <BiLoaderCircle className="animate-spin" size={25} />
            ) : (
              <button disabled={isDeleting} onClick={deletePost} className="">
                <BsTrash3 className="cursor-pointer" size={25} />
              </button>
            )}
          </div>
        ) : null}
      </div>
      <p className="px-8 mt-4 text-sm">{post.text}</p>
      <p className="flex items-center gap-2 px-8 mt-4 text-sm font-bold">
        <ImMusic size={17} />
        Original sound - {post?.profile.name}
      </p>
      <div className="flex items-center px-8 mt-8">
        <ClientOnly>
          <div className="pb-4 text-center flex items-center">
            <button
              disabled={hasClickedLike}
              onClick={likeOrUnLike}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
            >
              {!hasClickedLike ? (
                <AiFillHeart
                  color={likesByPost.length > 0 && userLiked ? "#ff2626" : ""}
                  size={25}
                />
              ) : (
                <BiLoaderCircle className="animate-spin" size={25} />
              )}
            </button>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              {likesByPost.length}
            </span>
          </div>
        </ClientOnly>
        <div className="pb-4 text-center flex items-center">
          <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
            <BsChatDots size={25} />
          </div>
          <span className="text-xs pl-2 text-gray-800 font-semibold">
            {commentsByPost.length}
          </span>
        </div>
      </div>
    </>
  );
}
