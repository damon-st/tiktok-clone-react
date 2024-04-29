"use client";
import { type CommentsCompTypes } from "@/app/types";
import ClientOnly from "@/app/components/ClientOnly";
import SingleComment from "./SingleComment";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { useCommentStore } from "@/app/stores/comment";
import { useUser } from "@/app/context/user";
import { useGeneralStore } from "@/app/stores/general";
import userCreateComment from "@/app/hooks/useCreateComment";

export default function Comments({ params }: CommentsCompTypes) {
  const { commentsByPost, setCommentsByPost } = useCommentStore();
  const [comment, setComment] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isuploading, setIsuploading] = useState(false);
  const conextUser = useUser();
  const { setIsLoginOpen } = useGeneralStore();

  const addComment = async () => {
    if (!conextUser?.user) return setIsLoginOpen(true);
    try {
      setIsuploading(true);
      await userCreateComment(conextUser.user.id, params.postId, comment);
      setCommentsByPost(params.postId);
      setComment("");
      setIsuploading(false);
    } catch (error) {
      setIsuploading(false);
      console.log(error);

      alert(error);
    }
  };

  useEffect(() => {
    setCommentsByPost(params.postId);
  }, [params.postId]);

  return (
    <>
      <div
        id="Comments"
        className="relative bg-[#F8F8F8] z-0 w-full h-[calc(100%-273px)] border-t-2 overflow-auto"
      >
        <div className=" pt-2" />
        <ClientOnly>
          {commentsByPost.length < 1 ? (
            <div className="text-center mt-6 text-xl text-gray-500">
              No comments...
            </div>
          ) : (
            <div>
              {commentsByPost.map((comment, index) => (
                <SingleComment key={index} comment={comment} params={params} />
              ))}
            </div>
          )}
        </ClientOnly>

        <div className="mb-28" />
        <div
          id="CreateComment"
          className="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2"
        >
          <div
            className={clsx(
              "bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px]",
              inputFocused
                ? "border-2 border-gray-400"
                : "border-2 border-[#F1F1F2]"
            )}
          >
            <input
              type="text"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="bg-[#F1F1F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
              placeholder="Add comment..."
            />
          </div>
          {!isuploading ? (
            <button
              disabled={!comment}
              onClick={addComment}
              className={clsx(
                "font-semibold text-sm ml-5 pr-1",
                comment ? "text-[#F02C56] cursor-pointer" : "text-gray-400"
              )}
            >
              Post
            </button>
          ) : (
            <BiLoaderCircle
              className="animate-spin"
              color="#E91E62"
              size={20}
            />
          )}
        </div>
      </div>
    </>
  );
}
