"use client";

import { useActionState, useState } from "react";
import { creerAvis, type EtatAvis } from "@/app/[slug]/avis/actions";

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
          <span style={{ color: (survol || note) >= n ? "var(--accent)" : "#d1d5db" }}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function FormulaireAvis({
  restaurantId,
  slug,
}: {
  restaurantId: string;
  slug: string;
}) {
  const [etat, action, enCours] = useActionState<EtatAvis | null, FormData>(creerAvis, null);
  const [note, setNote] = useState(0);

  if (etat?.succes) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="mb-2 text-2xl">✅</p>
        <p className="font-semibold text-green-800">{etat.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="note" value={note} />

      <div>
        <label className="block text-sm font-semibold text-gray-700">Votre note</label>
        <SelecteurEtoiles note={note} onChange={setNote} />
      </div>

      <div>
        <label htmlFor="nom_client" className="mb-1 block text-sm font-semibold text-gray-700">
          Votre nom (optionnel)
        </label>
        <input
          id="nom_client"
          name="nom_client"
          type="text"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30"
        />
      </div>

      <div>
        <label htmlFor="commentaire" className="mb-1 block text-sm font-semibold text-gray-700">
          Votre commentaire
        </label>
        <textarea
          id="commentaire"
          name="commentaire"
          rows={3}
          required
          minLength={5}
          placeholder="Partagez votre expérience..."
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30"
        />
      </div>

      {etat && !etat.succes && <p className="text-sm font-medium text-red-600">{etat.message}</p>}

      <button
        type="submit"
        disabled={enCours || note === 0}
        className="min-h-11 rounded-full px-6 py-3 font-semibold transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--primaire)" }}
      >
        {enCours ? "Envoi..." : "Publier mon avis"}
      </button>
    </form>
  );
}
