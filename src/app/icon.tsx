import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Monogramme NEHMA (fond sombre, "N" doré) — remplace l'icône Next.js par
// défaut. Réutilisé tel quel comme repli pour les restaurants sans logo
// (voir [slug]/icon.tsx).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110f",
          color: "#c9a86a",
          fontFamily: "serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        N
      </div>
    ),
    { ...size }
  );
}
