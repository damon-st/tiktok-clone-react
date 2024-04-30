"use client";
import { useUser } from "@/app/context/user";
import userCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import userSearchProfilesByName from "@/app/hooks/useSearchProfilesByName";
import { useGeneralStore } from "@/app/stores/general";
import { RandomUsers } from "@/app/types";
import clsx from "clsx";
import debounce from "debounce";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSearch, BiUser } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

export default function TopNav() {
  const [serachProfile, setSerachProfile] = useState<RandomUsers[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const conextUser = useUser();
  const { setIsLoginOpen, setIsEditProfileOpen } = useGeneralStore();
  const router = useRouter();
  const pathName = usePathname();
  const handleSearchName = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value == "") return setSerachProfile([]);
      try {
        const result = await userSearchProfilesByName(event.target.value);
        if (result) return setSerachProfile(result);
        setSerachProfile([]);
      } catch (error) {
        console.log(error);
        setSerachProfile([]);
        alert(error);
      }
    },
    500
  );
  const goTo = () => {
    if (!conextUser?.user) return setIsLoginOpen(true);
    router.push("/upload");
  };

  const onLogout = async () => {
    await conextUser?.logout();
    setShowMenu(false);
  };

  useEffect(() => {
    setIsEditProfileOpen(false);
  }, []);

  return (
    <>
      <div
        id="TopNav"
        className="fixed bg-white z-50 flex items-center w-full border-b h-[60px]"
      >
        <div
          className={clsx(
            "flex items-center justify-between gap-6 w-full px-4 mx-auto",
            pathName === "/" && "max-w-[1150px]"
          )}
        >
          <Link href="/">
            <picture>
              <img
                src="/images/tiktok-logo.png"
                alt="logo"
                className="min-w-[115px] w-[115px]"
              />
            </picture>
          </Link>
          <div className="relative hidden md:flex items-center justify-end bg-[#F1F1F2] p-1 rounded-full max-w-[430px] w-full">
            <input
              type="text"
              onChange={handleSearchName}
              className="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
              placeholder="Serach accounts"
            />
            {serachProfile.length > 0 ? (
              <div className="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1 rounded-lg">
                {serachProfile.map((profile, index) => (
                  <div key={profile.id} className="p-1">
                    <Link
                      href={`/profile/${profile.id}`}
                      className="flex items-center justify-between w-full cursor-pointer hover:bg-[#F12B56] p-1 px-2 hover:text-white rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <picture>
                          <img
                            src={userCreateBucketUrl(profile.image)}
                            alt="avat"
                            width="40"
                            className="rounded-md"
                          />
                        </picture>
                        <div className="truncate ml-2">{profile.name}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="px-3 py-1 flex items-center border-l border-l-gray-300">
              <BiSearch color="#A1A2A7" size={22} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5"
              onClick={goTo}
            >
              <AiOutlinePlus color="#000000" size={22} />
              <span className="px-2 font-medium text-[15px]">Upload</span>
            </button>
            {!conextUser?.user?.id ? (
              <div className="flex items-center">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px]"
                >
                  <span className="whitespace-nowrap mx-4 font-medium text-[15px]">
                    Log in
                  </span>
                </button>
                <button className="ml-2">
                  <BsThreeDotsVertical color="#161724" size={25} />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setShowMenu((r) => !r)}
                    className="mt-1 border border-gray-200 rounded-full"
                  >
                    <picture>
                      <img
                        src={userCreateBucketUrl(conextUser.user.image)}
                        alt="profiel"
                        className="rounded-full w-[35px]"
                      />
                    </picture>
                  </button>
                  {showMenu ? (
                    <div className="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[45px] right-0">
                      <button
                        onClick={() => {
                          router.push(`/profile/${conextUser.user?.id}`);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full justify-start py-3 px-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <BiUser size={20} />
                        <span className="pl-2 font-semibold text-sm">
                          Profile
                        </span>
                      </button>
                      <button
                        onClick={onLogout}
                        className="flex items-center w-full justify-start py-3 px-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <FiLogOut size={20} />
                        <span className="pl-2 font-semibold text-sm">
                          Log out
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
