import { ReactNode } from "react";
import TopNav from "./includes/TopNav";
type Props = {
  children: ReactNode;
};

export default function UploadLayout({ children }: Props) {
  return (
    <>
      <div className="bg-[#F8F8F8] h-[100vh]">
        <TopNav />
        <div className="flex justify-between mx-auto w-full px-2 max-w-[1140px]">
          {children}
        </div>
      </div>
    </>
  );
}
