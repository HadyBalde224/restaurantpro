"use client";

import { useState, type FormEvent } from "react";
import { creerAvisAdmin } from "@/app/admin/(protege)/avis/actions";

function SelecteurEtoiles({ note, onChange }: { note: number; onChange: (n: number) => void }) {
  const [survol, setSurvol] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setSurvol(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setSurvol(n)}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          className="flex h-11 w-11 items-center justify-center text-3xl transition-transform duration-150 hover:scale-110"
        >
          <span className={(survol || note) >= n ? "text-amber-500" : "text-gray-300"}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function AvisModal({
  onFermer,
  onMessage,
}: {
  onFermer: () => void;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const [nomClient, setNomClient] = useState("");
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur("");

    if (note === 0) {
      setErreur("Merci de choisir une note.");
      return;
    }

    setEnCours(true);
    const resultat = await creerAvisAdmin({ nomClient, note, commentaire });
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
        <h3 className="text-lg font-bold text-gray-900">Ajouter un avis</h3>
        <p className="mt-1 text-sm text-gray-500">
          Utile pour un avis reçu par téléphone, WhatsApp ou en salle. Publié immédiatement.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <SelecteurEtoiles note={note} onChange={setNote} />
          </div>

          <div>
            <label htmlFor="nom_client_avis" className="block text-sm font-medium text-gray-700">
              Nom du client (optionnel)
            </label>
            <input
              id="nom_client_avis"
              type="text"
              value={nomClient}
              onChange={(e) => setNomClient(e.target.value)}
              placeholder="Visiteur anonyme"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="commentaire_avis" className="block text-sm font-medium text-gray-700">
              Commentaire
            </label>
            <textarea
              id="commentaire_avis"
              rows={3}
              required
              minLength={5}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ce que le client a dit..."
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
              {enCours ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
