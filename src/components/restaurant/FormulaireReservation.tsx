"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { creerReservation, type EtatReservation } from "@/app/[slug]/reserver/actions";
import { indicatifPays } from "@/lib/pays";

export default function FormulaireReservation({
  restaurantId,
  devise,
}: {
  restaurantId: string;
  devise: string;
}) {
  const [etat, action, enCours] = useActionState<EtatReservation | null, FormData>(
    creerReservation,
    null
  );

  // Indicatif déduit du pays du restaurant (Guinée/Maroc) : le visiteur ne
  // saisit que son numéro local, l'indicatif est ajouté automatiquement pour
  // que le numéro enregistré soit toujours dans le même format (utilisé
  // ensuite par l'admin pour répondre sur WhatsApp).
  const indicatif = indicatifPays(devise);
  const [telephoneLocal, setTelephoneLocal] = useState("");
  const telephoneComplet = indicatif
    ? indicatif + telephoneLocal.replace(/\D/g, "").replace(/^0+/, "")
    : telephoneLocal;

  // "Aujourd'hui" calculé côté client uniquement, après montage : évaluer
  // new Date() pendant le rendu (serveur ET première passe client) peut
  // produire deux dates différentes si l'horloge serveur et celle du
  // visiteur ne sont pas dans le même fuseau, ou si le HTML a été mis en
  // cache à cheval sur minuit — ça déclenche une erreur d'hydratation sur
  // l'attribut `min`. Le contrôle réel de la date se fait de toute façon
  // côté serveur dans creerReservation ; ce `min` n'est qu'un confort.
  const [dateMin, setDateMin] = useState<string | undefined>(undefined);
  useEffect(() => {
    setDateMin(new Date().toISOString().split("T")[0]);
  }, []);

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
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 outline-none transition" />
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-semibold mb-1">
          Téléphone
        </label>
        <input type="hidden" name="telephone" value={telephoneComplet} />
        {indicatif ? (
          <div className="flex items-center rounded-xl border border-gray-300 pl-4 focus-within:border-(--accent) focus-within:ring-2 focus-within:ring-(--accent)/30 transition">
            <span className="shrink-0 text-sm text-gray-400">+{indicatif}</span>
            <input id="telephone" type="tel" inputMode="tel" required
              placeholder="6XX XX XX XX"
              value={telephoneLocal}
              onChange={(e) => setTelephoneLocal(e.target.value)}
              className="w-full rounded-xl px-2 py-3 outline-none" />
          </div>
        ) : (
          <input id="telephone" type="tel" inputMode="tel" required
            value={telephoneLocal}
            onChange={(e) => setTelephoneLocal(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 outline-none transition" />
        )}
      </div>

      <div>
        <label htmlFor="date_resa" className="block text-sm font-semibold mb-1">
          Date
        </label>
        <input id="date_resa" name="date_resa" type="date" required
          min={dateMin}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-(--accent) outline-none transition" />
      </div>

      <div>
        <label htmlFor="heure_resa" className="block text-sm font-semibold mb-1">
          Heure
        </label>
        <input id="heure_resa" name="heure_resa" type="time" required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-(--accent) outline-none transition" />
      </div>

      <div>
        <label htmlFor="nb_personnes" className="block text-sm font-semibold mb-1">
          Nombre de personnes
        </label>
        <input id="nb_personnes" name="nb_personnes" type="number" inputMode="numeric" min={1} max={50} defaultValue={2} required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-(--accent) outline-none transition" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="message" className="block text-sm font-semibold mb-1">
          Message (optionnel)
        </label>
        <textarea id="message" name="message" rows={3}
          placeholder="Anniversaire, terrasse, allergies..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-(--accent) outline-none transition" />
      </div>

      {etat && !etat.succes && (
        <p className="md:col-span-2 text-red-600 font-medium">{etat.message}</p>
      )}

      <button type="submit" disabled={enCours}
        className="md:col-span-2 rounded-full bg-(--accent) px-8 py-4 font-bold text-lg transition hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
        {enCours ? "Envoi en cours..." : "Demander une réservation"}
      </button>
    </form>
  );
}
