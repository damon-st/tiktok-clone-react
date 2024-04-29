"use client";
import { useUser } from "@/app/context/user";
import userCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import userDeleteComment from "@/app/hooks/useDeleteComment";
import { useCommentStore } from "@/app/stores/comment";
import { type SingleCommentCompTypes } from "@/app/types";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";

export default function SingleComment({
  comment,
  params,
}: SingleCommentCompTypes) {
  const contextUser = useUser();
  const { setCommentsByPost } = useCommentStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteThisComment = async () => {
    const res = confirm("Are you sure you weant to delete this comment?");
    if (!res) return;
    try {
      setIsDeleting(true);
      await userDeleteComment(comment.id);
      setCommentsByPost(params.postId);
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
      alert(error);
    }
  };
  return (
    <>
      <div
        id={`SingleComment-${comment.id}`}
        className="flex items-center justify-between px-8 mt-4"
      >
        <div className="flex items-center relative w-full">
          <Link href={`/profile/${comment.profile.user_id}`}>
            <picture>
              <img
                className="absolute top-0 rounded-full lg:mx-0 mx-auto"
                width={40}
                src={userCreateBucketUrl(comment.profile.image)}
                alt="user"
              />
            </picture>
          </Link>
          <div className="ml-14 pt-0.5 w-full">
            <div className="text-[18px] font-semibold flex items-center justify-between">
              <span className="flex items-center">
                {comment.profile.name} -{" "}
                <span className="text-[12px] text-gray-600 font-light ml-1">
                  {moment(comment.created_at).calendar()}
                </span>
              </span>
              {contextUser?.user?.id === comment.profile.user_id ? (
                <button disabled={isDeleting} onClick={deleteThisComment}>
                  {isDeleting ? (
                    <BiLoaderCircle
                      className="animate-spin"
                      color="#E91E62"
                      size={20}
                    />
                  ) : (
                    <BsTrash3 className="cursor-pointer" size={25} />
                  )}
                </button>
              ) : null}
            </div>
            <p className="text-[15px] font-light">{comment.text}</p>
          </div>
        </div>
      </div>
    </>
  );
}
