import { ImageResponse } from "next/og";
import { DESIGN_SYSTEM } from "@/styles/design-system";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 42,
          background: DESIGN_SYSTEM.gradient.apple,
          color: DESIGN_SYSTEM.color.white,
          fontSize: 82,
          fontWeight: 700,
          letterSpacing: -3,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16)",
      }}
    >
      iD
    </div>,
    {
      ...size,
    },
  );
}
