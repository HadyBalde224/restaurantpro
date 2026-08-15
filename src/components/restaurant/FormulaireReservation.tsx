"use client";

import { useActionState } from "react";
import { creerReservation, type EtatReservation } from "@/app/[slug]/reserver/actions";

export default function FormulaireReservation({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [etat, action, enCours] = useActionState<EtatReservation | null, FormData>(
    creerReservation,
    null
  );

  // Après succès : message de confirmation à la place du formulaire
  if (etat?.succes) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-green-800">{etat.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="restaurant_id" value={restaurantId} />

      <div>
        <label htmlFor="nom_client" className="block text-sm font-semibold mb-1">
          Votre nom
        </label>
        <input id="nom_client" name="nom_client" required minLength={2}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 outline-none transition" />
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-semibold mb-1">
          Téléphone
        </label>
        <input id="telephone" name="telephone" type="tel" required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 outline-none transition" />
      </div>

      <div>
        <label htmlFor="date_resa" className="block text-sm font-semibold mb-1">
          Date
        </label>
        <input id="date_resa" name="date_resa" type="date" required
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[var(--accent)] outline-none transition" />
      </div>

      <div>
        <label htmlFor="heure_resa" className="block text-sm font-semibold mb-1">
          Heure
        </label>
        <input id="heure_resa" name="heure_resa" type="time" required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[var(--accent)] outline-none transition" />
      </div>

      <div>
        <label htmlFor="nb_personnes" className="block text-sm font-semibold mb-1">
          Nombre de personnes
        </label>
        <input id="nb_personnes" name="nb_personnes" type="number" min={1} max={50} defaultValue={2} required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[var(--accent)] outline-none transition" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="message" className="block text-sm font-semibold mb-1">
          Message (optionnel)
        </label>
        <textarea id="message" name="message" rows={3}
          placeholder="Anniversaire, terrasse, allergies..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[var(--accent)] outline-none transition" />
      </div>

      {etat && !etat.succes && (
        <p className="md:col-span-2 text-red-600 font-medium">{etat.message}</p>
      )}

      <button type="submit" disabled={enCours}
        className="md:col-span-2 rounded-full bg-[var(--accent)] px-8 py-4 font-bold text-lg transition hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
        {enCours ? "Envoi en cours..." : "Demander une réservation"}
      </button>
    </form>
  );
}
