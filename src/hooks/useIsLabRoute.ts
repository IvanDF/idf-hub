"use client";

import { usePathname } from "next/navigation";

/**
 * Returns true when the current pathname begins with "/lab".
 */
export function useIsLabRoute(): boolean {
  const pathname = usePathname();
  return pathname.startsWith("/lab");
}
