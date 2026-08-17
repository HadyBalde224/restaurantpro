"use client";

import { useEffect, useState } from "react";
import type { Avis } from "@/lib/types";

const DUREE_AFFICHAGE_MS = 5000;
const DUREE_TRANSITION_MS = 400;

function Etoiles({ note }: { note: number }) {
  return (
    <div aria-label={`${note} sur 5`} className="flex gap-0.5" style={{ color: "var(--accent)" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(note) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function CarrouselAvis({ avis }: { avis: Avis[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (avis.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % avis.length);
        setVisible(true);
      }, DUREE_TRANSITION_MS);
    }, DUREE_AFFICHAGE_MS);

    return () => clearInterval(intervalle);
  }, [avis.length]);

  const allerA = (cible: number) => {
    if (cible === index) return;
    setVisible(false);
    setTimeout(() => {
      setIndex(cible);
      setVisible(true);
    }, DUREE_TRANSITION_MS);
  };

  const avisActif = avis[index];
  if (!avisActif) return null;

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <article
        className={`relative overflow-hidden rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-400 ease-in-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span
          className="pointer-events-none absolute -top-4 right-6 text-8xl leading-none text-white/10"
          style={{ fontFamily: "var(--font-titre)" }}
          aria-hidden="true"
        >
          &rdquo;
        </span>
        <Etoiles note={avisActif.note} />
        <p className="relative mt-3 text-lg text-white/85">« {avisActif.commentaire} »</p>
        <p className="relative mt-4 text-sm font-semibold text-white">{avisActif.nom_client}</p>
      </article>

      {avis.length > 1 && (
        <div className="mt-6 flex justify-center gap-1">
          {avis.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => allerA(i)}
              aria-label={`Voir l'avis ${i + 1}`}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? "1.25rem" : "0.375rem",
                  background: i === index ? "white" : "rgba(255,255,255,0.4)",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
