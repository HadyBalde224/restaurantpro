import { ImageResponse } from "next/og";
import { getRestaurant } from "@/lib/restaurant";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  // Pas de logo : on garde exactement le favicon par défaut du produit
  // (même rendu que src/app/icon.tsx) plutôt qu'une icône générique.
  if (!restaurant?.logo_url) {
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.logo_url}
          alt=""
          width={28}
          height={28}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
