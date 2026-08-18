"use client";

import { useState } from "react";

export type Pays = "guinee" | "maroc";

const DONNEES: Record<
  Pays,
  {
    libelle: string;
    whatsapp: string;
    installation: string;
    abonnement: string;
  }
> = {
  guinee: {
    libelle: "Guinée",
    whatsapp: "224622014609",
    installation: "500 000 – 800 000 GNF",
    abonnement: "100 000 GNF/mois",
  },
  maroc: {
    libelle: "Maroc",
    whatsapp: "212693269381",
    installation: "500 – 800 MAD",
    abonnement: "100 MAD/mois",
  },
};

export default function SectionTarifs({
  pays: paysControle,
  onChangePays,
}: {
  // Contrôlable depuis un parent (pour partager l'état avec la section Démo) ;
  // sans ces props, le composant gère son propre état comme avant.
  pays?: Pays;
  onChangePays?: (pays: Pays) => void;
} = {}) {
  const [paysInterne, setPaysInterne] = useState<Pays>("guinee");
  const pays = paysControle ?? paysInterne;
  const changerPays = onChangePays ?? setPaysInterne;
  const donnees = DONNEES[pays];
  const messagePreecrit = encodeURIComponent("Bonjour, je souhaite un site pour mon restaurant");
  const lienWhatsApp = `https://wa.me/${donnees.whatsapp}?text=${messagePreecrit}`;

  return (
    <div className="mx-auto max-w-md">
      <div className="mx-auto flex w-fit gap-1 rounded-full border border-white/10 bg-(--surface) p-1">
        {(Object.keys(DONNEES) as Pays[]).map((cle) => (
          <button
            key={cle}
            type="button"
            onClick={() => changerPays(cle)}
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

      <div
        className="relative mt-8 rounded-2xl border p-8"
        style={{ borderColor: "var(--or)", background: "color-mix(in srgb, var(--or) 8%, var(--surface))" }}
      >
        <p className="font-bold text-white" style={{ fontSize: "clamp(1.375rem, 6vw, 1.875rem)" }}>
          {donnees.abonnement}
        </p>
        <ul className="mt-5 space-y-2.5 text-sm text-white/70">
          <li>Site professionnel personnalisé</li>
          <li>Menu numérique modifiable</li>
          <li>Réservations de table</li>
          <li>Commandes WhatsApp illimitées</li>
          <li>Support inclus</li>
        </ul>
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
