"use client";

import { useState } from "react";
import type { CategorieMenu, Plat } from "@/lib/types";
import PlatLigne from "@/components/admin/menu/PlatLigne";
import { deplacerCategorie } from "@/app/admin/(protege)/menu/actions";

export default function CategorieCard({
  categorie,
  devise,
  estPremiere,
  estDerniere,
  onRenommer,
  onSupprimer,
  onAjouterPlat,
  onModifierPlat,
  onSupprimerPlat,
  onMessage,
}: {
  categorie: CategorieMenu;
  devise: string;
  estPremiere: boolean;
  estDerniere: boolean;
  onRenommer: () => void;
  onSupprimer: () => void;
  onAjouterPlat: () => void;
  onModifierPlat: (plat: Plat) => void;
  onSupprimerPlat: (plat: Plat) => void;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const [deplacementEnCours, setDeplacementEnCours] = useState(false);

  const deplacer = async (direction: "haut" | "bas") => {
    setDeplacementEnCours(true);
    const resultat = await deplacerCategorie(categorie.id, direction);
    setDeplacementEnCours(false);
    if (!resultat.succes) onMessage(resultat.message, true);
  };

  const plats = categorie.plats.slice().sort((a, b) => a.ordre - b.ordre);

  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => deplacer("haut")}
              disabled={estPremiere || deplacementEnCours}
              aria-label="Monter la catégorie"
              className="flex h-11 w-11 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-30"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => deplacer("bas")}
              disabled={estDerniere || deplacementEnCours}
              aria-label="Descendre la catégorie"
              className="flex h-11 w-11 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-900 disabled:opacity-30"
            >
              ▼
            </button>
          </div>
          <h2 className="text-lg font-bold text-gray-900">{categorie.nom}</h2>
          <span className="text-sm text-gray-400">({plats.length})</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRenommer}
            className="min-h-11 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100"
          >
            Renommer
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

      <div className="divide-y divide-black/5">
        {plats.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-gray-400">Aucun plat dans cette catégorie.</p>
        ) : (
          plats.map((plat) => (
            <PlatLigne
              key={plat.id}
              plat={plat}
              devise={devise}
              onModifier={() => onModifierPlat(plat)}
              onSupprimer={() => onSupprimerPlat(plat)}
              onMessage={onMessage}
            />
          ))
        )}
      </div>

      <div className="px-5 py-4">
        <button
          type="button"
          onClick={onAjouterPlat}
          className="w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700"
        >
          + Ajouter un plat
        </button>
      </div>
    </div>
  );
}
