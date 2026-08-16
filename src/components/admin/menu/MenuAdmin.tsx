"use client";

import { useState } from "react";
import type { CategorieMenu, Plat } from "@/lib/types";
import CategorieCard from "@/components/admin/menu/CategorieCard";
import CategorieModal from "@/components/admin/menu/CategorieModal";
import PlatModal from "@/components/admin/menu/PlatModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { supprimerCategorie, supprimerPlat } from "@/app/admin/(protege)/menu/actions";

type ModeCategorieModal = { mode: "creer" } | { mode: "renommer"; categorie: CategorieMenu };
type PlatModalEtat = { categorieId: string; plat?: Plat };
type Confirmation =
  | { type: "categorie"; id: string; nom: string }
  | { type: "plat"; id: string; nom: string };

export default function MenuAdmin({
  categories,
  restaurantId,
  devise,
}: {
  categories: CategorieMenu[];
  restaurantId: string;
  devise: string;
}) {
  const [modalCategorie, setModalCategorie] = useState<ModeCategorieModal | null>(null);
  const [modalPlat, setModalPlat] = useState<PlatModalEtat | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const afficherMessage = (texte: string, erreur = false) => {
    setMessage({ texte, erreur });
    setTimeout(() => setMessage(null), 4000);
  };

  const confirmerSuppression = async () => {
    if (!confirmation) return;
    setSuppressionEnCours(true);
    const resultat =
      confirmation.type === "categorie"
        ? await supprimerCategorie(confirmation.id)
        : await supprimerPlat(confirmation.id);
    setSuppressionEnCours(false);
    setConfirmation(null);
    afficherMessage(resultat.message, !resultat.succes);
  };

  const categoriesTriees = categories.slice().sort((a, b) => a.ordre - b.ordre);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="mt-1 text-gray-500">Gérez vos catégories et vos plats.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalCategorie({ mode: "creer" })}
          style={{ background: "var(--accent)", color: "var(--primaire)" }}
          className="min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90"
        >
          + Nouvelle catégorie
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            message.erreur ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {message.texte}
        </div>
      )}

      {categoriesTriees.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          Aucune catégorie pour l&apos;instant. Créez-en une pour commencer à ajouter des plats.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {categoriesTriees.map((categorie, index) => (
            <CategorieCard
              key={categorie.id}
              categorie={categorie}
              devise={devise}
              estPremiere={index === 0}
              estDerniere={index === categoriesTriees.length - 1}
              onRenommer={() => setModalCategorie({ mode: "renommer", categorie })}
              onSupprimer={() =>
                setConfirmation({ type: "categorie", id: categorie.id, nom: categorie.nom })
              }
              onAjouterPlat={() => setModalPlat({ categorieId: categorie.id })}
              onModifierPlat={(plat) => setModalPlat({ categorieId: categorie.id, plat })}
              onSupprimerPlat={(plat) => setConfirmation({ type: "plat", id: plat.id, nom: plat.nom })}
              onMessage={afficherMessage}
            />
          ))}
        </div>
      )}

      {modalCategorie && (
        <CategorieModal
          modeInitial={modalCategorie}
          onFermer={() => setModalCategorie(null)}
          onMessage={afficherMessage}
        />
      )}

      {modalPlat && (
        <PlatModal
          categories={categoriesTriees}
          categorieId={modalPlat.categorieId}
          plat={modalPlat.plat}
          restaurantId={restaurantId}
          devise={devise}
          onFermer={() => setModalPlat(null)}
          onMessage={afficherMessage}
        />
      )}

      {confirmation && (
        <ConfirmDialog
          titre={confirmation.type === "categorie" ? "Supprimer la catégorie ?" : "Supprimer le plat ?"}
          description={
            confirmation.type === "categorie"
              ? `"${confirmation.nom}" et TOUS ses plats seront définitivement supprimés. Cette action est irréversible.`
              : `"${confirmation.nom}" sera définitivement supprimé. Cette action est irréversible.`
          }
          enCours={suppressionEnCours}
          onAnnuler={() => setConfirmation(null)}
          onConfirmer={confirmerSuppression}
        />
      )}
    </div>
  );
}
