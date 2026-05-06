import { ImageResponse } from "next/og";

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
        background:
          "radial-gradient(circle at 20% 22%, #2f8dff 0%, rgba(47,141,255,0) 42%), radial-gradient(circle at 78% 80%, #13c5a3 0%, rgba(19,197,163,0) 40%), linear-gradient(140deg, #05070b 0%, #0f1728 100%)",
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
          color: "#f7fbff",
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
