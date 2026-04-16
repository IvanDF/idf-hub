"use client";

import CustomCursor from "@/components/atoms/CustomCursor";
import AudioPrompt from "@/components/molecules/AudioPrompt";
import GlobalBackground from "@/components/organisms/Background/GlobalBackground";
import { usePathname } from "next/navigation";
import SecretGateway from "./SecretGateway";

/** Cursor is always visible. Background, audio prompt and secret gateway are hidden on /admin. */
export default function SiteChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      <CustomCursor />
      {!isAdmin && <SecretGateway />}
      {!isAdmin && <AudioPrompt />}
      {!isAdmin && <GlobalBackground />}
    </>
  );
}
