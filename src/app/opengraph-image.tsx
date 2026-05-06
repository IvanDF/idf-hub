import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "radial-gradient(circle at 8% 18%, #2f8dff 0%, rgba(47,141,255,0) 36%), radial-gradient(circle at 92% 82%, #13c5a3 0%, rgba(19,197,163,0) 40%), linear-gradient(135deg, #06080d 0%, #0b1220 100%)",
        color: "#f2f6ff",
        padding: "72px",
        fontFamily: "Segoe UI",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 30,
          letterSpacing: 10,
          textTransform: "uppercase",
          opacity: 0.82,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex" }}>iDF 2.0</div>
        <div
          style={{
            display: "flex",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.26)",
            padding: "8px 14px",
            letterSpacing: 3,
            fontSize: 24,
            color: "#ffffff",
            background: "rgba(10,18,30,0.45)",
          }}
        >
          iD
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          maxWidth: "88%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          Tiny Details.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          Big Wow.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            lineHeight: 1.35,
            opacity: 0.9,
            marginTop: 10,
          }}
        >
          Portfolio hub of interactive experiments, crafted UI polish, and
          share-ready visual impact.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          opacity: 0.9,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          paddingTop: 18,
        }}
      >
        <div style={{ display: "flex" }}>idf-hub.vercel.app</div>
        <div style={{ display: "flex", letterSpacing: 3 }}>
          INTERACTIVE PORTFOLIO
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
