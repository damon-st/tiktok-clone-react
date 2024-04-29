"use client";
import { useEffect } from "react";
import { type PostUserCompTypes } from "../../types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { SiSoundcharts } from "react-icons/si";
import { BiErrorCircle } from "react-icons/bi";
import userCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";

export default function PostUser({ post }: PostUserCompTypes) {
  const idVideo = `video-${post.id}`;
  useEffect(() => {
    const video = document.getElementById(idVideo) as HTMLVideoElement;
    const handleMouseEnter = () => {
      video.play();
    };
    const handleMouseLeave = () => {
      video.pause();
    };
    setTimeout(() => {
      video.addEventListener("mouseenter", handleMouseEnter);
      video.addEventListener("mouseleave", handleMouseLeave);
    }, 50);

    return () => {
      video.removeEventListener("mouseenter", handleMouseEnter);
      video.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
        {!post.video_url ? (
          <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
            <AiOutlineLoading3Quarters
              className="animate-spin ml-1"
              color="#fffffff"
              size={80}
            />
          </div>
        ) : (
          <Link href={`/post/${post.id}/${post.user_id}`}>
            <video
              id={idVideo}
              muted
              loop
              className="aspect-[3/4] object-cover rounded-md"
              src={userCreateBucketUrl(post.video_url)}
            />
          </Link>
        )}
        <div className="px-1">
          <p className="text-gray-700 text-[15px] pt-1 break-words">
            {post.text}
          </p>
          <div className="flex items-center gap-1 ml-1 text-gray-600 font-bold text-xs">
            <SiSoundcharts size={15} />
            3%
            <BiErrorCircle size={16} />
          </div>
        </div>
      </div>
    </>
  );
}
