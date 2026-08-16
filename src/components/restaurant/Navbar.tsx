"use client";

import { useEffect, useState } from "react";

const LIENS = [
  { href: "#menu", libelle: "Menu" },
  { href: "#avis", libelle: "Avis" },
  { href: "#localisation", libelle: "Localisation" },
];

export default function Navbar({ nom }: { nom: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fondSolide = scrolled || ouvert;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ background: fondSolide ? "var(--primaire)" : "transparent" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <span
          className="text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-titre)" }}
        >
          {nom}
        </span>

        <div className="hidden items-center gap-8 text-sm font-medium text-white/90 sm:flex">
          {LIENS.map((lien) => (
            <a
              key={lien.href}
              href={lien.href}
              className="transition-colors duration-300 hover:text-white"
            >
              {lien.libelle}
            </a>
          ))}
          <a
            href="#reserver"
            className="rounded-full px-4 py-1.5 font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--accent)", color: "var(--primaire)" }}
          >
            Réserver
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={ouvert}
          className="flex h-11 w-11 items-center justify-center text-white sm:hidden"
        >
          {ouvert ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {ouvert && (
        <div className="flex flex-col border-t border-white/10 pb-2 sm:hidden">
          {LIENS.map((lien) => (
            <a
              key={lien.href}
              href={lien.href}
              onClick={() => setOuvert(false)}
              className="flex min-h-11 items-center px-6 font-medium text-white/90 transition-colors duration-200 hover:text-white"
            >
              {lien.libelle}
            </a>
          ))}
          <a
            href="#reserver"
            onClick={() => setOuvert(false)}
            className="mx-6 mt-2 flex min-h-11 items-center justify-center rounded-full px-4 font-semibold"
            style={{ background: "var(--accent)", color: "var(--primaire)" }}
          >
            Réserver
          </a>
        </div>
      )}
    </nav>
  );
}
