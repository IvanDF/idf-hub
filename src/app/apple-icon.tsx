import { ImageResponse } from "next/og";

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
        background:
          "radial-gradient(circle at 22% 18%, #40a3ff 0%, rgba(64,163,255,0) 42%), linear-gradient(145deg, #05070b 0%, #121b2b 100%)",
        color: "#ffffff",
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
