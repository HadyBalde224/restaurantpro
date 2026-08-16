"use client";

import { useState } from "react";
import type { Avis } from "@/lib/types";
import { approuverAvis, depublierAvis, supprimerAvis } from "@/app/admin/(protege)/avis/actions";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import BadgeStatut from "@/components/admin/BadgeStatut";

function Etoiles({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < note ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function formaterDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CarteAvis({
  avis,
  onMessage,
}: {
  avis: Avis;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const [enCours, setEnCours] = useState(false);
  const [confirmationSuppression, setConfirmationSuppression] = useState(false);

  const approuver = async () => {
    setEnCours(true);
    const resultat = await approuverAvis(avis.id);
    setEnCours(false);
    onMessage(resultat.message, !resultat.succes);
  };

  const depublier = async () => {
    setEnCours(true);
    const resultat = await depublierAvis(avis.id);
    setEnCours(false);
    onMessage(resultat.message, !resultat.succes);
  };

  const confirmerSuppression = async () => {
    setEnCours(true);
    const resultat = await supprimerAvis(avis.id);
    setEnCours(false);
    setConfirmationSuppression(false);
    onMessage(resultat.message, !resultat.succes);
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900">{avis.nom_client}</p>
            <BadgeStatut statut={avis.approuve ? "publie" : "a_moderer"} />
          </div>
          <Etoiles note={avis.note} />
        </div>
        <p className="text-xs text-gray-400">{formaterDate(avis.cree_le)}</p>
      </div>

      {avis.commentaire && <p className="mt-3 text-sm text-gray-600">« {avis.commentaire} »</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {avis.approuve ? (
          <button
            type="button"
            onClick={depublier}
            disabled={enCours}
            className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {enCours ? "..." : "Dépublier"}
          </button>
        ) : (
          <button
            type="button"
            onClick={approuver}
            disabled={enCours}
            className="min-h-11 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {enCours ? "Approbation..." : "Approuver"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setConfirmationSuppression(true)}
          disabled={enCours}
          className="min-h-11 rounded-xl px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
        >
          Supprimer
        </button>
      </div>

      {confirmationSuppression && (
        <ConfirmDialog
          titre="Supprimer cet avis ?"
          description={`L'avis de "${avis.nom_client}" sera définitivement supprimé.`}
          enCours={enCours}
          onAnnuler={() => setConfirmationSuppression(false)}
          onConfirmer={confirmerSuppression}
        />
      )}
    </div>
  );
}
