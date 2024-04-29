"use client";
import ClientOnly from "@/app/components/ClientOnly";
import PostUser from "@/app/components/profile/PostUser";
import { useUser } from "@/app/context/user";
import userCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import MainLayout from "@/app/layouts/MainLayout";
import { useGeneralStore } from "@/app/stores/general";
import { usePostStore } from "@/app/stores/post";
import { useProfileStore } from "@/app/stores/profile";
import { type ProfilePageTypes } from "@/app/types";
import { useEffect } from "react";
import { BsPencil } from "react-icons/bs";

export default function ProfilePage({ params }: ProfilePageTypes) {
  const contextUser = useUser();
  const { postsByUser, setPostByUser } = usePostStore();
  const { setCurrentProfile, currentProfile } = useProfileStore();
  const { isEditProfileOpen, setIsEditProfileOpen } = useGeneralStore();
  useEffect(() => {
    setCurrentProfile(params.id);
    setPostByUser(params.id);
  }, [params.id]);

  return (
    <>
      <MainLayout>
        <div className="pt-[90px] ml-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 w-[calc(100%-90px)] pr-3 max-w-[1800px] 2xl:mx-auto">
          <div className="flex w-[calc(100vw-230px)]">
            <ClientOnly>
              {currentProfile ? (
                <picture>
                  <img
                    className="w-[120px] min-w-[120px] rounded-full"
                    src={userCreateBucketUrl(currentProfile?.image)}
                    alt="user"
                  />
                </picture>
              ) : (
                <div className="min-w-[150px] h-[120px] bg-gray-200 rounded-full"></div>
              )}
            </ClientOnly>
            <div className="ml-5 w-full">
              <ClientOnly>
                {currentProfile?.name ? (
                  <div>
                    <p className="text-[30px] font-bold truncate">
                      {currentProfile.name}
                    </p>
                    <p className="text-[18px] truncate">
                      {currentProfile.name}
                    </p>
                  </div>
                ) : (
                  <div className="h-[60px]"></div>
                )}
              </ClientOnly>

              {contextUser?.user?.id == params.id ? (
                <button
                  onClick={() => setIsEditProfileOpen(!isEditProfileOpen)}
                  className="flex items-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100"
                >
                  <BsPencil className="mt-0.5 mr-1" size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button className="flex items-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]">
                  Follow
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center pt-4">
            <div className="mr-4">
              <span className="font-bold">10K</span>
              <span className="text-gray-500 font-light text-[15px] pl-1.5 cursor-pointer hover:underline">
                Following
              </span>
            </div>
            <div className="mr-4">
              <span className="font-bold">40K</span>
              <span className="text-gray-500 font-light text-[15px] pl-1.5 cursor-pointer hover:underline">
                Following
              </span>
            </div>
            <div className="mr-4">
              <span className="font-bold">400K</span>
              <span className="text-gray-500 font-light text-[15px] pl-1.5">
                Likes
              </span>
            </div>
          </div>
          <ClientOnly>
            <p className="pt-4 mr-4 text-gray-400 font-light text-[15px] pl-1.5 max-w-[500px]">
              {currentProfile?.bio}
            </p>
          </ClientOnly>
          <ul className="w-full flex items-center pt-4 border-b">
            <li className="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">
              Videos
            </li>
            <li className="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">
              Likes
            </li>
          </ul>
          <ClientOnly>
            <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
              {postsByUser.map((post, index) => (
                <PostUser key={post.id} post={post} />
              ))}
            </div>
          </ClientOnly>
        </div>
      </MainLayout>
    </>
  );
}
