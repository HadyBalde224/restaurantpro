import type { Restaurant } from "@/lib/types";
import Apparition from "@/components/Apparition";

export default function Footer({ restaurant }: { restaurant: Restaurant }) {
  return (
    <footer
      className="mt-auto px-6 py-10 text-center text-sm text-white sm:px-8"
      style={{ background: "var(--primaire)" }}
    >
      <Apparition>
        <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-titre)" }}>
          {restaurant.nom}
        </p>
        <p className="mt-2 text-white/70">
          {restaurant.adresse}, {restaurant.ville} · {restaurant.telephone}
        </p>
        {(restaurant.instagram || restaurant.facebook) && (
          <div className="mt-4 flex justify-center gap-4 text-white/70">
            {restaurant.instagram && (
              <a
                href={restaurant.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-white"
              >
                Instagram
              </a>
            )}
            {restaurant.facebook && (
              <a
                href={restaurant.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-white"
              >
                Facebook
              </a>
            )}
          </div>
        )}
        <p className="mt-6 text-xs text-white/40">
          © {new Date().getFullYear()} {restaurant.nom}
        </p>
      </Apparition>
    </footer>
  );
}
