import { ImageResponse } from "next/og";

export const alt = "NEHMA — Sites vitrines pour restaurants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110f",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontStyle: "italic",
            fontFamily: "serif",
            fontWeight: 700,
            color: "#c9a86a",
            display: "flex",
          }}
        >
          N
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, color: "#ffffff", marginTop: 12, display: "flex" }}>
          NEHMA
        </div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginTop: 8, display: "flex" }}>
          Sites vitrines pour restaurants
        </div>
      </div>
    ),
    { ...size }
  );
}
