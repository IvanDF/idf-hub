"use client";

import CustomCursor from "@/components/atoms/custom-cursor";
import AudioPrompt from "@/components/molecules/audio-prompt";
import GlobalBackground from "@/components/organisms/background";
import { usePathname } from "next/navigation";
import SecretGateway from "./SecretGateway";

/** Cursor is always visible. Background, audio prompt and secret gateway are hidden on /admin and /business-card. */
export default function SiteChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isBusinessCard = pathname?.startsWith("/business-card");
  const hideChrome = isAdmin || isBusinessCard;

  return (
    <>
      <CustomCursor />
      {!hideChrome && <SecretGateway />}
      {!hideChrome && <AudioPrompt />}
      {!hideChrome && <GlobalBackground />}
    </>
  );
}
