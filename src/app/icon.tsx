import { ImageResponse } from "next/og";
import { DESIGN_SYSTEM } from "@/styles/design-system";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: DESIGN_SYSTEM.gradient.icon,
        }}
    >
      <div
        style={{
          width: 340,
          height: 340,
          borderRadius: 86,
          border: "2px solid rgba(255,255,255,0.25)",
          background: "rgba(8, 12, 20, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: DESIGN_SYSTEM.color.iconText,
          fontSize: 142,
          fontWeight: 700,
          letterSpacing: -6,
          lineHeight: 1,
          boxShadow:
            "0 24px 70px rgba(4,7,13,0.55), inset 0 0 0 1px rgba(255,255,255,0.12)",
        }}
      >
        iD
      </div>
    </div>,
    {
      ...size,
    },
  );
}
