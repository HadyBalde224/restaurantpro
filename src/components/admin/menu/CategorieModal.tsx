"use client";

import { useState, type FormEvent } from "react";
import { creerCategorie, renommerCategorie } from "@/app/admin/(protege)/menu/actions";
import type { CategorieMenu } from "@/lib/types";

type ModeCategorieModal = { mode: "creer" } | { mode: "renommer"; categorie: CategorieMenu };

export default function CategorieModal({
  modeInitial,
  onFermer,
  onMessage,
}: {
  modeInitial: ModeCategorieModal;
  onFermer: () => void;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const [nom, setNom] = useState(modeInitial.mode === "renommer" ? modeInitial.categorie.nom : "");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur("");
    setEnCours(true);

    const resultat =
      modeInitial.mode === "creer"
        ? await creerCategorie(nom)
        : await renommerCategorie(modeInitial.categorie.id, nom);

    setEnCours(false);

    if (!resultat.succes) {
      setErreur(resultat.message);
      return;
    }

    onMessage(resultat.message);
    onFermer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onFermer} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900">
          {modeInitial.mode === "creer" ? "Nouvelle catégorie" : "Renommer la catégorie"}
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="nom_categorie" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              id="nom_categorie"
              type="text"
              required
              autoFocus
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex. Entrées, Tajines, Desserts..."
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {erreur && <p className="text-sm font-medium text-red-600">{erreur}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onFermer}
              disabled={enCours}
              className="min-h-11 flex-1 rounded-xl border border-gray-300 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={enCours}
              style={{ background: "var(--accent)", color: "var(--primaire)" }}
              className="min-h-11 flex-1 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-60"
            >
              {enCours ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
