"use client";
import { useEffect, useState } from "react";
import { type Comment, type Like, type PostMainLikesCompTypes } from "../types";
import { AiFillHeart } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { FaCommentDots, FaShare, FaBookmark } from "react-icons/fa";
import { useGeneralStore } from "../stores/general";
import { useUser } from "../context/user";
import userGetCommentsByPostId from "../hooks/useGetCommentsByPostId";
import userGetLikesByPostId from "../hooks/useGetLikesByPostId";
import userIsLiked from "../hooks/useIsLiked";
import userCreateLike from "../hooks/useCreateLike";
import userDeleteLike from "../hooks/useDeleteLike";

export default function PostMainLikes({ post }: PostMainLikesCompTypes) {
  const { setIsLoginOpen } = useGeneralStore();
  const contextUser = useUser();
  const router = useRouter();
  const [hasClikedLike, setHasClikedLike] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    getAllLikesByPost();
    getAllCommentsByPost();
  }, [post]);

  useEffect(() => {
    hasUserLikedPost();
  }, [likes, contextUser]);

  const hasUserLikedPost = () => {
    if (!contextUser) return;
    if (likes.length < 1 || !contextUser?.user?.id) {
      setUserLiked(false);
      return;
    }
    let res = userIsLiked(contextUser.user.id, post.id, likes);
    setUserLiked(res ? true : false);
  };

  const getAllLikesByPost = async () => {
    let result = await userGetCommentsByPostId(post.id);
    setComments(result);
  };
  const getAllCommentsByPost = async () => {
    let result = await userGetLikesByPostId(post.id);
    setLikes(result);
  };

  const handleClickGoToPost = () => {
    router.push(`/post/${post.id}/${post.profile.user_id}`);
  };

  const like = async () => {
    try {
      setHasClikedLike(true);
      await userCreateLike(contextUser?.user?.id ?? "", post.id);
      await getAllCommentsByPost();
      hasUserLikedPost();
      setHasClikedLike(false);
    } catch (error) {
      setHasClikedLike(false);
      console.log(error);
      alert(error);
    }
  };
  const unLike = async (id: string) => {
    try {
      setHasClikedLike(true);
      await userDeleteLike(id);
      await getAllCommentsByPost();
      hasUserLikedPost();
      setHasClikedLike(false);
    } catch (error) {
      setHasClikedLike(false);
      console.log(error);
      alert(error);
    }
  };

  const likeOrUnLike = () => {
    if (!contextUser?.user) return setIsLoginOpen(true);
    let res = userIsLiked(contextUser.user.id, post.id, likes);
    if (!res) {
      like();
    } else {
      likes.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser.user.id == like.user_id &&
          like.post_id == post.id
        ) {
          unLike(like.id);
        }
      });
    }
  };

  return (
    <>
      <div id={`PostMainLikes-${post.id}`} className="relative mr-[15px]">
        <div className="absolute bottom-0 pl-2">
          <div className="pb-4 text-center">
            <button
              disabled={hasClikedLike}
              onClick={() => likeOrUnLike()}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
            >
              {!hasClikedLike ? (
                <AiFillHeart
                  color={likes?.length > 0 && userLiked ? "#ff2626" : ""}
                  size={25}
                />
              ) : (
                <BiLoaderCircle className="animate-spin" size={25} />
              )}
            </button>
            <span className="text-xs text-gray-800 font-semibold">
              {likes.length}
            </span>
          </div>
          <button className="pb-4 text-center" onClick={handleClickGoToPost}>
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaCommentDots size={25} />
            </div>
            <div className="text-xs text-gray-800 font-semibold">
              {comments.length}
            </div>
          </button>
          <button className="text-center pb-4">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaBookmark size={25} />
            </div>
            <div className="text-xs text-gray-800 font-semibold">0</div>
          </button>
          <button className="text-center">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaShare size={25} />
            </div>
            <div className="text-xs text-gray-800 font-semibold">55</div>
          </button>
        </div>
      </div>
    </>
  );
}
