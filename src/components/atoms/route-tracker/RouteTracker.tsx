"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function getRoute(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/lab")) return "work";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/admin")) return "admin";
  return "default";
}

export default function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const route = getRoute(pathname);
    document.body.setAttribute("data-route", route);
  }, [pathname]);

  return null;
}
