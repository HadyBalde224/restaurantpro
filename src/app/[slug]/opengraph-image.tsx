import { ImageResponse } from "next/og";
import { getRestaurant } from "@/lib/restaurant";

export const alt = "Aperçu du restaurant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Priorité : photo de couverture du restaurant > logo > visuel de repli NEHMA.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  const photo = restaurant?.photos_hero?.[0];
  const logo = restaurant?.logo_url;

  if (photo) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" width={size.width} height={size.height} style={{ objectFit: "cover" }} />
        </div>
      ),
      { ...size }
    );
  }

  if (logo) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: restaurant?.couleur_primaire || "#14100D",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={300} height={300} style={{ objectFit: "contain" }} />
        </div>
      ),
      { ...size }
    );
  }

  // Ni photo ni logo : visuel de repli propre du produit NEHMA.
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
        {restaurant?.nom && (
          <div style={{ fontSize: 40, fontWeight: 600, color: "#ffffff", marginTop: 8, display: "flex" }}>
            {restaurant.nom}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
