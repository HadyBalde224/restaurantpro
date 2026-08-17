import type { Restaurant } from "@/lib/types";
import CarrouselHero from "@/components/restaurant/CarrouselHero";

function IconeCloche({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 17c0-5 4-9 9-9s9 4 9 9" />
      <path d="M2 17h20" />
      <path d="M12 8V5M9.5 5h5" />
    </svg>
  );
}

function IconeEtoile({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.6l-5.9 3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z" />
    </svg>
  );
}

function IconeLocalisation({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function Hero({
  restaurant,
  noteMoyenne,
}: {
  restaurant: Restaurant;
  noteMoyenne: number | null;
}) {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      <CarrouselHero photos={restaurant.photos_hero ?? []} nom={restaurant.nom} />

      {/* Ambiance sombre premium : dégradé plus dense côté texte (gauche) + voile global */}
      <div
        className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/30"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-10 text-center sm:px-12 sm:pt-32 lg:px-20">
        <div className="mx-auto max-w-[640px]">
          <div className="anim-fade-up flex flex-col items-center" style={{ animationDelay: "0ms" }}>
            <span
              className="mb-5 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              {restaurant.ville}
            </span>
            <h1
              className="font-bold leading-[1.05] text-white"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              {restaurant.nom}
            </h1>
          </div>

          <p
            className="anim-fade-up mt-6 line-clamp-3 text-base text-white/85 sm:text-lg"
            style={{ animationDelay: "150ms" }}
          >
            {restaurant.description}
          </p>

          <div
            className="anim-fade-up mt-8 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href="#reserver"
              className="rounded-xl px-6 py-3 font-semibold transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--accent)", color: "var(--primaire)" }}
            >
              Réserver une table
            </a>
            <a
              href="#menu"
              className="rounded-xl border border-white/40 px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-white/10"
            >
              Découvrir le menu
            </a>
          </div>
        </div>
      </div>

      {/* Bande d'atouts */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center justify-center gap-3 px-6 py-4">
            <IconeCloche className="text-(--accent)" />
            <span className="text-sm font-medium text-white">Cuisine faite maison</span>
          </div>
          <div className="flex items-center justify-center gap-3 px-6 py-4">
            <IconeEtoile className="text-(--accent)" />
            <span className="text-sm font-medium text-white">
              {noteMoyenne !== null ? `Note ${noteMoyenne.toFixed(1)}/5` : "Réservation en ligne"}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 px-6 py-4">
            <IconeLocalisation className="text-(--accent)" />
            <span className="text-sm font-medium text-white">{restaurant.ville}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
