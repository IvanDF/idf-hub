"use client";

import { usePathname } from "next/navigation";

export function useIsLabRoute(): boolean {
  const pathname = usePathname();
  return pathname.startsWith("/lab");
}
