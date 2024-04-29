"use client";

import { useGeneralStore } from "../stores/general";
import AuthOverlay from "./AuthOverlay";
import ClientOnly from "./ClientOnly";
import EdiProfileOverlay from "./profile/EdiProfileOverlay";

export default function AllOverlays() {
  const { isLoginOpen, isEditProfileOpen } = useGeneralStore();

  return (
    <>
      <ClientOnly>
        {isLoginOpen ? <AuthOverlay /> : null}
        {isEditProfileOpen ? <EdiProfileOverlay /> : null}
      </ClientOnly>
    </>
  );
}
