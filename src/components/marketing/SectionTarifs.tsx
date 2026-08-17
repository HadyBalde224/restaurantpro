"use client";

import { useState } from "react";

type Pays = "guinee" | "maroc";

const DONNEES: Record<
  Pays,
  {
    libelle: string;
    whatsapp: string;
    installation: string;
    standard: string;
    pro: string;
  }
> = {
  guinee: {
    libelle: "Guinée",
    whatsapp: "224622014608",
    installation: "500 000 – 800 000 GNF (selon la taille du restaurant)",
    standard: "100 000 GNF/mois",
    pro: "200 000 GNF/mois",
  },
  maroc: {
    libelle: "Maroc",
    whatsapp: "212693269381",
    installation: "1 500 MAD",
    standard: "200 MAD/mois",
    pro: "350 MAD/mois",
  },
};

export default function SectionTarifs() {
  const [pays, setPays] = useState<Pays>("guinee");
  const donnees = DONNEES[pays];
  const messagePreecrit = encodeURIComponent("Bonjour, je souhaite un site pour mon restaurant");
  const lienWhatsApp = `https://wa.me/${donnees.whatsapp}?text=${messagePreecrit}`;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mx-auto flex w-fit gap-1 rounded-full border border-white/10 bg-(--surface) p-1">
        {(Object.keys(DONNEES) as Pays[]).map((cle) => (
          <button
            key={cle}
            type="button"
            onClick={() => setPays(cle)}
            className="min-h-11 rounded-full px-6 text-sm font-semibold transition-colors duration-200"
            style={
              pays === cle
                ? { background: "var(--or)", color: "var(--fond)" }
                : { color: "rgba(255,255,255,0.6)" }
            }
          >
            {DONNEES[cle].libelle}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-white/60">
        Installation : <span className="font-semibold text-white/85">{donnees.installation}</span>
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-(--surface) p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white">Standard</h3>
          <p className="mt-2 text-3xl font-bold text-white">{donnees.standard}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-white/70">
            <li>Site professionnel complet</li>
            <li>Menu numérique modifiable</li>
            <li>Commandes WhatsApp</li>
            <li>Réservations de table</li>
          </ul>
        </div>

        <div
          className="relative rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: "var(--or)", background: "color-mix(in srgb, var(--or) 8%, var(--surface))" }}
        >
          <span
            className="absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "var(--or)", color: "var(--fond)" }}
          >
            Recommandé
          </span>
          <h3 className="text-lg font-bold text-white">Pro</h3>
          <p className="mt-2 text-3xl font-bold text-white">{donnees.pro}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-white/70">
            <li>Tout le plan Standard</li>
            <li>Réservations illimitées</li>
            <li>Support prioritaire</li>
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-white/50">
        Premier mois offert pour nos premiers clients partenaires
      </p>

      <div className="mt-6 flex justify-center">
        <a
          href={lienWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center rounded-full px-8 py-3 font-semibold transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: "var(--or)", color: "var(--fond)" }}
        >
          Demander mon site
        </a>
      </div>
    </div>
  );
}
