"use client";

import { useMemo, useState } from "react";
import type { Avis } from "@/lib/types";
import CarteAvis from "@/components/admin/avis/CarteAvis";
import AvisModal from "@/components/admin/avis/AvisModal";

type Onglet = "attente" | "publies";

export default function AvisAdmin({ avis }: { avis: Avis[] }) {
  const [onglet, setOnglet] = useState<Onglet>("attente");
  const [modalOuverte, setModalOuverte] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const afficherMessage = (texte: string, erreur = false) => {
    setMessage({ texte, erreur });
    setTimeout(() => setMessage(null), 4000);
  };

  const enAttente = useMemo(() => avis.filter((a) => !a.approuve), [avis]);
  const publies = useMemo(() => avis.filter((a) => a.approuve), [avis]);

  const noteMoyenne = useMemo(() => {
    if (publies.length === 0) return 0;
    return publies.reduce((s, a) => s + a.note, 0) / publies.length;
  }, [publies]);

  const listeActive = onglet === "attente" ? enAttente : publies;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avis</h1>
          <p className="mt-1 text-gray-500">Modérez les avis laissés par vos clients.</p>
        </div>
        <div className="flex items-center gap-4">
          {publies.length > 0 && (
            <div className="rounded-2xl border border-black/5 bg-white px-5 py-3 text-right shadow-sm">
              <p className="text-2xl font-bold text-amber-500">★ {noteMoyenne.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{publies.length} avis publiés</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setModalOuverte(true)}
            style={{ background: "var(--accent)", color: "var(--primaire)" }}
            className="min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90"
          >
            + Ajouter un avis
          </button>
        </div>
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

      <div className="mt-6 flex gap-2 border-b border-black/5">
        <button
          type="button"
          onClick={() => setOnglet("attente")}
          className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
            onglet === "attente"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          En attente de modération
          {enAttente.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
              {enAttente.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOnglet("publies")}
          className={`rounded-t-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
            onglet === "publies"
              ? "border-b-2 border-gray-900 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Publiés
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {listeActive.length === 0 ? (
          <p className="py-10 text-center text-gray-400">Aucun avis ici.</p>
        ) : (
          listeActive.map((a) => <CarteAvis key={a.id} avis={a} onMessage={afficherMessage} />)
        )}
      </div>

      {modalOuverte && (
        <AvisModal onFermer={() => setModalOuverte(false)} onMessage={afficherMessage} />
      )}
    </div>
  );
}
