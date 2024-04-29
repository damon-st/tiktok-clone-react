"use client";

import { ReactNode, useEffect, useState } from "react";
type Props = {
  children: ReactNode;
};

export default function ClientOnly({ children }: Props) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <div>{children}</div>;
}
