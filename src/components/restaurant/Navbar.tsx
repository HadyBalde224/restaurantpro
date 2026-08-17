"use client";

import { useEffect, useMemo, useState } from "react";

const LIENS_BASE = [
  { href: "#menu", id: "menu", libelle: "Menu" },
  { href: "#horaires", id: "horaires", libelle: "Horaires" },
  { href: "#localisation", id: "localisation", libelle: "Nous trouver" },
  { href: "#avis", id: "avis", libelle: "Avis" },
];

const LIEN_GALERIE = { href: "#galerie", id: "galerie", libelle: "Galerie" };

export default function Navbar({
  nom,
  whatsapp,
  horaireAujourdhui,
  aGalerie = false,
}: {
  nom: string;
  whatsapp: string;
  horaireAujourdhui: string;
  aGalerie?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [sectionActive, setSectionActive] = useState<string | null>(null);

  // Insère "Galerie" juste après "Menu" seulement si le restaurant a des photos.
  const liens = useMemo(
    () => (aGalerie ? [LIENS_BASE[0], LIEN_GALERIE, ...LIENS_BASE.slice(1)] : LIENS_BASE),
    [aGalerie]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy : observe les sections plutôt que d'écouter le scroll brut.
  // La bande fine au centre du viewport (rootMargin négatif) désigne la
  // section "active" au lieu de la dernière traversée.
  useEffect(() => {
    const elements = liens.map((lien) => document.getElementById(lien.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) setSectionActive(entree.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, [liens]);

  // Verrouille le scroll du body tant que le menu plein écran est ouvert.
  useEffect(() => {
    document.body.style.overflow = ouvert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  const fermeAujourdhui = horaireAujourdhui === "Fermé";
  const messageWhatsApp = encodeURIComponent(`Bonjour ${nom} !`);
  const lienWhatsApp = whatsapp ? `https://wa.me/${whatsapp}?text=${messageWhatsApp}` : null;

  const liensMobile = [...liens, { href: "#reserver", id: "reserver", libelle: "Réserver une table" }];

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]" : "bg-black/40 backdrop-blur-md"
        }`}
        style={{ background: scrolled ? "var(--primaire)" : undefined }}
      >
        <div
          className={`mx-auto flex w-full max-w-6xl items-center justify-between px-6 transition-[height] duration-300 sm:px-8 ${
            scrolled ? "h-15" : "h-18"
          }`}
        >
          <div className="flex min-w-0 flex-col justify-center">
            <span
              className="truncate text-lg font-bold text-white italic"
              style={{ fontFamily: "var(--font-titre)" }}
            >
              {nom}
            </span>
            {horaireAujourdhui && (
              <span
                className="hidden text-xs lg:block"
                style={{ color: fermeAujourdhui ? "var(--accent)" : "rgba(255,255,255,0.65)" }}
              >
                Aujourd&apos;hui : {horaireAujourdhui}
              </span>
            )}
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            {liens.map((lien) => {
              const actif = sectionActive === lien.id;
              return (
                <a
                  key={lien.id}
                  href={lien.href}
                  className={`group relative flex min-h-11 items-center text-sm font-medium transition-colors duration-300 ${
                    actif ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {lien.libelle}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-(--accent) transition-transform duration-250 ${
                      actif ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
            <a
              href="#reserver"
              className="rounded-full px-5 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
              style={{ background: "var(--accent)", color: "var(--primaire)" }}
            >
              Réserver une table
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={ouvert}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center text-white lg:hidden"
          >
            <span
              className={`absolute h-0.5 w-6 rounded-full bg-white transition-transform duration-300 ${
                ouvert ? "rotate-45" : "-translate-y-1.5"
              }`}
              aria-hidden="true"
            />
            <span
              className={`absolute h-0.5 w-6 rounded-full bg-white transition-transform duration-300 ${
                ouvert ? "-rotate-45" : "translate-y-1.5"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Menu plein écran mobile (<1024px) */}
      <div
        className={`fixed inset-0 z-100 flex flex-col backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          ouvert ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "color-mix(in srgb, var(--primaire) 97%, transparent)" }}
        aria-hidden={!ouvert}
      >
        <div className="flex h-18 shrink-0 items-center justify-between px-6">
          <span
            className="truncate text-lg font-bold text-white italic"
            style={{ fontFamily: "var(--font-titre)" }}
          >
            {nom}
          </span>
          <button
            type="button"
            onClick={() => setOuvert(false)}
            aria-label="Fermer le menu"
            tabIndex={ouvert ? 0 : -1}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center text-white"
          >
            <span className="absolute h-0.5 w-6 rotate-45 rounded-full bg-white" aria-hidden="true" />
            <span className="absolute h-0.5 w-6 -rotate-45 rounded-full bg-white" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-start gap-5 overflow-y-auto px-8 pt-10 pb-6">
          {liensMobile.map((lien, index) => (
            <a
              key={lien.id}
              href={lien.href}
              onClick={() => setOuvert(false)}
              tabIndex={ouvert ? 0 : -1}
              className={`min-h-11 py-1 text-4xl font-bold text-white transition-all duration-300 ${
                ouvert ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{
                fontFamily: "var(--font-titre)",
                transitionDelay: ouvert ? `${index * 60}ms` : "0ms",
              }}
            >
              {lien.libelle}
            </a>
          ))}
        </div>

        {horaireAujourdhui && (
          <p
            className="shrink-0 px-8 pb-4 text-sm"
            style={{ color: fermeAujourdhui ? "var(--accent)" : "rgba(255,255,255,0.7)" }}
          >
            Aujourd&apos;hui : {horaireAujourdhui}
          </p>
        )}

        {lienWhatsApp && (
          <a
            href={lienWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOuvert(false)}
            tabIndex={ouvert ? 0 : -1}
            className="mx-6 mb-8 flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/15"
          >
            Contacter sur WhatsApp
          </a>
        )}
      </div>
    </>
  );
}
