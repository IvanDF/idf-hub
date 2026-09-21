"use client";

import CustomCursor from "@/components/atoms/custom-cursor";
import { usePathname } from "next/navigation";
import SecretGateway from "./SecretGateway";

/**
 * Cursor is always visible. The secret gateway is hidden on /admin and
 * /business-card.
 *
 * The audio prompt used to mount here: a modal on first visit whose overlay
 * swallowed pointer events, so nothing on the site could be clicked until it
 * was answered. The offer now lives on the control itself — see
 * useAudioNudge — and in the terminal's `sound` command.
 *
 * The WebGL background used to mount here. It extruded 1536 paths out of the
 * same 581 KB SVG that `.container` already paints as a CSS background-image,
 * so the artwork was rendered twice on every page — once flat by the
 * rasteriser, once as 3D geometry under a custom shader. The flat one stays.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isBusinessCard = pathname?.startsWith("/business-card");
  const hideChrome = isAdmin || isBusinessCard;

  return (
    <>
      <CustomCursor />
      {!hideChrome && <SecretGateway />}
    </>
  );
}
