"use client";
import { useEffect } from "react";
import { type PostMainCompTypes } from "../types";
import Link from "next/link";
import { ImMusic } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import PostMainLikes from "./PostMainLikes";
import userCreateBucketUrl from "../hooks/useCreateBucketUrl";

export default function PostMain({ post }: PostMainCompTypes) {
  const idPost = `PostMain-${post.id}`;
  const idVideo = `video-${post.id}`;
  const hasTacks = ["#fun", "#cool", "#SuperAwesome"];
  useEffect(() => {
    const video = document.getElementById(idVideo) as HTMLVideoElement;
    const postMainElement = document.getElementById(idPost);
    if (!postMainElement) return;
    let observer = new IntersectionObserver(
      (entries) => {
        entries[0].isIntersecting ? video.play() : video.pause();
      },
      { threshold: [0.6] }
    );
    observer.observe(postMainElement);
    return () => observer.unobserve(postMainElement);
  }, []);

  return (
    <>
      <div id={idPost} className="flex border-b py-6">
        <div className="cursor-pointer">
          <picture>
            <img
              loading="lazy"
              src={userCreateBucketUrl(post.profile.image)}
              alt="video"
              className="rounded-full max-h-[60px]"
              width={60}
            />
          </picture>
        </div>
        <div className="pl-3 w-full px-4">
          <div className="flex items-center justify-between pb-0.5">
            <Link href={`/profile/${post.profile.user_id}`}>
              <span className="font-bold hover:underline cursor-pointer">
                {post.profile.name}
              </span>
            </Link>
            <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>
          <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
            {post.text}
          </p>
          <p className="text-[14px] text-gray-500 pb-0.5">
            {hasTacks.map((e, i) => (
              <Link key={e} href={`/tag/${e.substring(1, e.length)}`}>
                <span className="hover:underline ml-1 cursor-pointer">{e}</span>
              </Link>
            ))}
          </p>
          <p className="text-[12px] pb-0.5 flex items-center font-semibold">
            <ImMusic size={12} />
            <span className="px-1">Original sound - AWESOME</span>
            <AiFillHeart size={15} />
          </p>
          <div className="mt-2.5 flex">
            <div className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
              <video
                id={idVideo}
                loop
                controls
                muted
                className="rounded-xl object-cover mx-auto h-full"
                src={userCreateBucketUrl(post.video_url)}
              />
              <picture>
                <img
                  loading="lazy"
                  className="absolute right-2 bottom-10"
                  src="/images/tiktok-logo-white.png"
                  alt="video"
                  width={90}
                />
              </picture>
            </div>
            <PostMainLikes post={post} />
          </div>
        </div>
      </div>
    </>
  );
}
