"use client";

import { useState } from "react";
import type { Plat } from "@/lib/types";
import { changerDisponibilite } from "@/app/admin/(protege)/menu/actions";

export default function PlatLigne({
  plat,
  devise,
  onModifier,
  onSupprimer,
  onMessage,
}: {
  plat: Plat;
  devise: string;
  onModifier: () => void;
  onSupprimer: () => void;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const [basculeEnCours, setBasculeEnCours] = useState(false);

  const basculerDisponibilite = async () => {
    setBasculeEnCours(true);
    const resultat = await changerDisponibilite(plat.id, !plat.disponible);
    setBasculeEnCours(false);
    if (!resultat.succes) onMessage(resultat.message, true);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {plat.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={plat.photo_url} alt={plat.nom} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">🍽️</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-900">{plat.nom}</p>
        <p className="text-sm text-gray-500">
          {plat.prix} {devise}
        </p>
      </div>

      <button
        type="button"
        onClick={basculerDisponibilite}
        disabled={basculeEnCours}
        aria-label={plat.disponible ? "Marquer comme épuisé" : "Marquer comme disponible"}
        aria-pressed={plat.disponible}
        className="flex h-11 w-11 shrink-0 items-center justify-center disabled:opacity-50"
      >
        <span
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
            plat.disponible ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
              plat.disponible ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </span>
      </button>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onModifier}
          className="min-h-11 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100"
        >
          Modifier
        </button>
        <button
          type="button"
          onClick={onSupprimer}
          className="min-h-11 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
