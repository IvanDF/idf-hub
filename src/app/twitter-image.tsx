import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(150deg, #041f38 0%, #0a111b 48%, #132b33 100%)",
        color: "#f7fbff",
        padding: "64px",
        fontFamily: "Segoe UI",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 28,
          letterSpacing: 7,
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        <div style={{ display: "flex" }}>iDF 2.0</div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ display: "flex" }}>Share Ready</div>
          <div
            style={{
              display: "flex",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.28)",
              padding: "7px 12px",
              letterSpacing: 3,
              fontSize: 20,
              background: "rgba(11,20,32,0.42)",
            }}
          >
            iD
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: "90%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 86,
            lineHeight: 0.98,
            fontWeight: 700,
          }}
        >
          Crafted for
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 86,
            lineHeight: 0.98,
            fontWeight: 700,
          }}
        >
          wow moments
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 30,
          lineHeight: 1.3,
          opacity: 0.92,
        }}
      >
        Interactive portfolio and effects playground with polished visual
        previews on every shared link.
      </div>
    </div>,
    {
      ...size,
    },
  );
}
