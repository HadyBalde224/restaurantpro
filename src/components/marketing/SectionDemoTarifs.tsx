"use client";

import { useState } from "react";
import Image from "next/image";
import Apparition from "@/components/Apparition";
import SectionTarifs, { type Pays } from "@/components/marketing/SectionTarifs";

const NOMS_PAYS: Record<Pays, string> = { guinee: "Guinée", maroc: "Maroc" };
const GENTILE: Record<Pays, string> = { guinee: "guinéen", maroc: "marocain" };

export type DemoParPays = Record<
  Pays,
  { nom: string; slug: string; photoUrl: string | null }
>;

// Toggle Guinée/Maroc réutilisé tel quel (même style que celui de
// SectionTarifs) pour piloter la démo depuis cette section aussi.
function ToggleMarche({
  pays,
  onChange,
}: {
  pays: Pays;
  onChange: (pays: Pays) => void;
}) {
  return (
    <div className="mx-auto flex w-fit gap-1 rounded-full border border-white/10 bg-(--surface) p-1">
      {(Object.keys(NOMS_PAYS) as Pays[]).map((cle) => (
        <button
          key={cle}
          type="button"
          onClick={() => onChange(cle)}
          className="min-h-11 rounded-full px-6 text-sm font-semibold transition-colors duration-200"
          style={
            pays === cle
              ? { background: "var(--or)", color: "var(--fond)" }
              : { color: "rgba(255,255,255,0.6)" }
          }
        >
          {NOMS_PAYS[cle]}
        </button>
      ))}
    </div>
  );
}

export default function SectionDemoTarifs({ demos }: { demos: DemoParPays }) {
  const [pays, setPays] = useState<Pays>("guinee");
  // Petite transition en fondu plutôt qu'un changement brut de la démo —
  // même principe que CarrouselAvis/CarrouselHero : on masque, on échange
  // le contenu, on réaffiche.
  const [visible, setVisible] = useState(true);

  const changerPays = (nouveau: Pays) => {
    if (nouveau === pays) return;
    setVisible(false);
    setTimeout(() => {
      setPays(nouveau);
      setVisible(true);
    }, 250);
  };

  const demo = demos[pays];
  const texte = `Découvrez ${demo.nom}, un restaurant ${GENTILE[pays]} propulsé par NEHMA`;

  return (
    <>
      {/* DÉMO */}
      <section className="px-6 py-24 sm:px-8 md:py-32">
        <Apparition>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-(--or) uppercase">La démo</p>
            <h2
              className="mt-3 font-bold text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Voyez à quoi ressemble votre futur site
            </h2>
          </div>

          <div className="mx-auto mt-8 w-fit">
            <ToggleMarche pays={pays} onChange={changerPays} />
          </div>
        </Apparition>

        <Apparition delai={150}>
          <div
            className={`mx-auto mt-8 max-w-3xl transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 bg-black/40 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="ml-3 truncate rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                  nehma.app/{demo.slug}
                </span>
              </div>
              <div className="relative aspect-16/10 bg-(--surface)">
                {demo.photoUrl ? (
                  <Image
                    src={demo.photoUrl}
                    alt={`Aperçu du site de ${demo.nom}`}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">
                    Aperçu à venir
                  </div>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-white/60">{texte}</p>

            <div className="mt-3 text-center">
              <a
                href={`/${demo.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-semibold text-(--or) transition-opacity duration-200 hover:opacity-80"
              >
                Explorer le site de démonstration →
              </a>
            </div>
          </div>
        </Apparition>
      </section>

      {/* TARIFS */}
      <section className="px-6 py-24 sm:px-8 md:py-32">
        <Apparition>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-(--or) uppercase">Tarifs</p>
            <h2
              className="mt-3 font-bold text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Un tarif simple, sans surprise
            </h2>
            <p className="mt-4 text-white/60">
              Moins cher qu&apos;une seule commission de livraison par mois.
            </p>
          </div>
        </Apparition>
        <Apparition delai={150}>
          <div className="mt-12">
            <SectionTarifs pays={pays} onChangePays={changerPays} />
          </div>
        </Apparition>
      </section>
    </>
  );
}
