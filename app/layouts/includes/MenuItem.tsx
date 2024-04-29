"use client";

import { type MenuItemsTypes } from "@/app/types";
import clsx from "clsx";
import { AiOutlineHome } from "react-icons/ai";
import { BsCameraVideo } from "react-icons/bs";
import { RiGroupLine } from "react-icons/ri";

export default function MenuItem({
  colorString,
  iconString,
  sizeString,
}: MenuItemsTypes) {
  const icons = () => {
    if (iconString == "For You")
      return <AiOutlineHome size={sizeString} color={colorString} />;
    if (iconString == "Following")
      return <RiGroupLine size={sizeString} color={colorString} />;
    if (iconString == "LIVE")
      return <BsCameraVideo size={sizeString} color={colorString} />;
  };
  return (
    <>
      <div className="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
        <div className="flex items-center lg:mx-0 mx-auto">
          {icons()}
          <p
            className={clsx(
              "lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px]",
              `text-[${colorString}]`
            )}
          >
            {iconString}
          </p>
        </div>
      </div>
    </>
  );
}
