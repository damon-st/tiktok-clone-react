import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { clsx } from "clsx";
import TopNav from "./includes/TopNav";
import SideNavMain from "./includes/SideNavMain";
type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  const pathName = usePathname();
  return (
    <>
      <TopNav />
      <div
        className={clsx(
          "flex justify-between mx-auto w-full lg:px-2.5 px-0",
          pathName == "/" ? "max-w-[1140px]" : ""
        )}
      >
        <SideNavMain />
        {children}
      </div>
    </>
  );
}
