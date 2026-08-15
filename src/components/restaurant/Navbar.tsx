"use client";

import { useEffect, useState } from "react";

export default function Navbar({ nom }: { nom: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ background: scrolled ? "var(--primaire)" : "transparent" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <span
          className="text-lg font-bold text-white"
          style={{ fontFamily: "var(--font-titre)" }}
        >
          {nom}
        </span>
        <div className="hidden gap-8 text-sm font-medium text-white/90 sm:flex">
          <a href="#menu" className="transition-colors duration-300 hover:text-white">
            Menu
          </a>
          <a href="#avis" className="transition-colors duration-300 hover:text-white">
            Avis
          </a>
          <a href="#localisation" className="transition-colors duration-300 hover:text-white">
            Localisation
          </a>
          <a
            href="#reserver"
            className="rounded-full px-4 py-1.5 font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--accent)", color: "var(--primaire)" }}
          >
            Réserver
          </a>
        </div>
      </div>
    </nav>
  );
}
