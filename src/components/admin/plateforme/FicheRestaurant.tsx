"use client";

import { useState, type FormEvent } from "react";
import { changerStatutRestaurant, enregistrerAbonnement } from "@/app/admin/(protege)/plateforme/actions";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import BadgeStatut from "@/components/admin/BadgeStatut";
import { IconeExterne } from "@/components/admin/Icones";
import type { Abonnement, Restaurant } from "@/lib/types";

export default function FicheRestaurant({
  restaurant,
  abonnement,
}: {
  restaurant: Restaurant;
  abonnement: Abonnement | null;
}) {
  const [actif, setActif] = useState(restaurant.actif);
  const [confirmationStatut, setConfirmationStatut] = useState(false);
  const [changementEnCours, setChangementEnCours] = useState(false);
  const [messageStatut, setMessageStatut] = useState("");

  const [plan, setPlan] = useState(abonnement?.plan ?? "Standard");
  const [prixMensuel, setPrixMensuel] = useState(String(abonnement?.prix_mensuel ?? 0));
  const [payeJusquAu, setPayeJusquAu] = useState(abonnement?.paye_jusqu_au ?? "");
  const [notes, setNotes] = useState(abonnement?.notes ?? "");
  const [enregistrementEnCours, setEnregistrementEnCours] = useState(false);
  const [messageAbonnement, setMessageAbonnement] = useState<{ texte: string; erreur: boolean } | null>(null);

  const urlSite = `${typeof window !== "undefined" ? window.location.origin : ""}/${restaurant.slug}`;

  const confirmerChangementStatut = async () => {
    setChangementEnCours(true);
    const resultat = await changerStatutRestaurant(restaurant.id, !actif);
    setChangementEnCours(false);
    setConfirmationStatut(false);
    if (resultat.succes) setActif(!actif);
    setMessageStatut(resultat.message);
  };

  const handleSubmitAbonnement = async (e: FormEvent) => {
    e.preventDefault();
    setEnregistrementEnCours(true);
    setMessageAbonnement(null);
    const resultat = await enregistrerAbonnement(restaurant.id, {
      plan,
      prixMensuel: Number(prixMensuel),
      payeJusquAu: payeJusquAu || null,
      notes,
    });
    setEnregistrementEnCours(false);
    setMessageAbonnement({ texte: resultat.message, erreur: !resultat.succes });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Statut</h2>
            <BadgeStatut statut={actif ? "actif" : "suspendu"} />
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={urlSite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <IconeExterne size={16} />
              Voir son site
            </a>
            <button
              type="button"
              onClick={() => setConfirmationStatut(true)}
              className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition ${
                actif
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {actif ? "Suspendre" : "Activer"}
            </button>
          </div>
        </div>
        {messageStatut && <p className="mt-3 text-sm font-medium text-gray-600">{messageStatut}</p>}

        <dl className="mt-5 grid gap-4 border-t border-black/5 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-gray-500">Ville</dt>
            <dd className="text-sm text-gray-900">{restaurant.ville || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Devise</dt>
            <dd className="text-sm text-gray-900">{restaurant.devise}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">WhatsApp</dt>
            <dd className="text-sm text-gray-900">{restaurant.whatsapp || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{restaurant.email || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-gray-500">Adresse du site</dt>
            <dd className="text-sm text-gray-900">/{restaurant.slug}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Abonnement</h2>

        <form onSubmit={handleSubmitAbonnement} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                Plan
              </label>
              <input
                id="plan"
                type="text"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label htmlFor="prix_mensuel" className="block text-sm font-medium text-gray-700">
                Prix mensuel (MAD)
              </label>
              <input
                id="prix_mensuel"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={prixMensuel}
                onChange={(e) => setPrixMensuel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="paye_jusqu_au" className="block text-sm font-medium text-gray-700">
              Payé jusqu&apos;au
            </label>
            <input
              id="paye_jusqu_au"
              type="date"
              value={payeJusquAu ?? ""}
              onChange={(e) => setPayeJusquAu(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:w-64"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes internes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Historique de paiement, contact, remarques..."
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={enregistrementEnCours}
              style={{ background: "var(--accent)", color: "var(--primaire)" }}
              className="min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90 disabled:opacity-60"
            >
              {enregistrementEnCours ? "Enregistrement..." : "Enregistrer"}
            </button>
            {messageAbonnement && (
              <span className={`text-sm font-medium ${messageAbonnement.erreur ? "text-red-600" : "text-green-600"}`}>
                {messageAbonnement.texte}
              </span>
            )}
          </div>
        </form>
      </section>

      {confirmationStatut && (
        <ConfirmDialog
          titre={actif ? "Suspendre ce restaurant ?" : "Activer ce restaurant ?"}
          description={
            actif
              ? `Le site de "${restaurant.nom}" deviendra inaccessible au public jusqu'à réactivation.`
              : `Le site de "${restaurant.nom}" redeviendra accessible au public.`
          }
          enCours={changementEnCours}
          labelConfirmer={actif ? "Suspendre" : "Activer"}
          labelEnCours={actif ? "Suspension..." : "Activation..."}
          variante={actif ? "danger" : "primaire"}
          onAnnuler={() => setConfirmationStatut(false)}
          onConfirmer={confirmerChangementStatut}
        />
      )}
    </div>
  );
}
