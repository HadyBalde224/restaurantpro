import type { Restaurant } from "@/lib/types";
import CarrouselHero from "@/components/restaurant/CarrouselHero";

export default function Hero({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-12">
      <CarrouselHero photos={restaurant.photos_hero ?? []} nom={restaurant.nom} />

      <div
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="anim-fade-up flex flex-col items-center" style={{ animationDelay: "0ms" }}>
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm tracking-wide text-white backdrop-blur-sm">
            {restaurant.ville}
          </span>
          <h1
            className="max-w-3xl font-bold leading-[1.05] text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
          >
            {restaurant.nom}
          </h1>
        </div>

        <p
          className="anim-fade-up max-w-xl text-lg text-white/85 sm:text-xl"
          style={{ animationDelay: "150ms" }}
        >
          {restaurant.description}
        </p>

        <div
          className="anim-fade-up flex flex-wrap justify-center gap-4 pt-2"
          style={{ animationDelay: "300ms" }}
        >
          <a
            href="#reserver"
            className="rounded-full px-6 py-3 font-medium text-(--primaire) transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--accent)" }}
          >
            Réserver une table
          </a>
          <a
            href="#menu"
            className="rounded-full border border-white px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-white/10"
          >
            Découvrir le menu
          </a>
        </div>
      </div>

      <a
        href="#menu"
        aria-label="Défiler vers le menu"
        className="anim-rebond absolute bottom-6 left-1/2 z-10 flex h-11 w-11 items-center justify-center text-white/80 transition-colors duration-300 hover:text-white"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}
