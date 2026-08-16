"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DUREE_AFFICHAGE_MS = 5000;

export default function CarrouselHero({ photos, nom }: { photos: string[]; nom: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalle = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, DUREE_AFFICHAGE_MS);

    return () => clearInterval(intervalle);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(160deg, var(--primaire) 0%, color-mix(in srgb, var(--primaire) 55%, black) 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {photos.map((url, i) => (
          <div
            key={url}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-1500 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={url}
              alt={i === 0 ? nom : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${i === index ? "anim-ken-burns" : ""}`}
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <div
          className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2"
          aria-hidden="true"
        >
          {photos.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? "1.25rem" : "0.375rem",
                background: i === index ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
