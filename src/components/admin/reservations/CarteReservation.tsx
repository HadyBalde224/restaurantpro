"use client";

import { useState } from "react";
import type { Reservation } from "@/lib/types";
import { confirmerReservation, refuserReservation } from "@/app/admin/(protege)/reservations/actions";
import BadgeStatut from "@/components/admin/BadgeStatut";
import { indicatifPays } from "@/lib/pays";

function formaterDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formaterHeure(heure: string) {
  return heure.slice(0, 5);
}

function formaterDateDemande(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Nettoie le numéro (chiffres uniquement) et remplace le 0 initial par
// l'indicatif du pays du restaurant, déduit de sa devise.
function formaterTelephoneWhatsApp(telephone: string, devise: string): string {
  const chiffres = telephone.replace(/\D/g, "");
  if (chiffres.startsWith("0")) {
    const indicatif = indicatifPays(devise) ?? "";
    return indicatif + chiffres.slice(1);
  }
  return chiffres;
}

function messageWhatsApp(reservation: Reservation, nomRestaurant: string): string {
  const date = formaterDate(reservation.date_resa);
  const heure = formaterHeure(reservation.heure_resa);

  if (reservation.statut === "confirmee") {
    return `Bonjour ${reservation.nom_client}, votre table pour ${reservation.nb_personnes} personnes le ${date} à ${heure} est confirmée ! À bientôt chez ${nomRestaurant} 🎉`;
  }
  if (reservation.statut === "refusee") {
    return `Bonjour ${reservation.nom_client}, nous ne pouvons malheureusement pas honorer votre demande du ${date} à ${heure} pour ${reservation.nb_personnes} personnes. N'hésitez pas à nous contacter pour trouver un autre créneau. Merci de votre compréhension — ${nomRestaurant}`;
  }
  return `Bonjour ${reservation.nom_client}, à propos de votre demande de réservation pour ${reservation.nb_personnes} personnes le ${date} à ${heure}...`;
}

export default function CarteReservation({
  reservation,
  nomRestaurant,
  devise,
  onMessage,
}: {
  reservation: Reservation;
  nomRestaurant: string;
  devise: string;
  onMessage: (texte: string, erreur?: boolean) => void;
}) {
  const [enCours, setEnCours] = useState<"confirmer" | "refuser" | null>(null);

  const agir = async (action: "confirmer" | "refuser") => {
    setEnCours(action);
    const resultat =
      action === "confirmer"
        ? await confirmerReservation(reservation.id)
        : await refuserReservation(reservation.id);
    setEnCours(null);
    onMessage(resultat.message, !resultat.succes);
  };

  const lienWhatsApp = `https://wa.me/${formaterTelephoneWhatsApp(
    reservation.telephone,
    devise
  )}?text=${encodeURIComponent(messageWhatsApp(reservation, nomRestaurant))}`;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900">{reservation.nom_client}</p>
            <BadgeStatut statut={reservation.statut} />
          </div>
          <p className="text-sm text-gray-500">{reservation.telephone}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {formaterDate(reservation.date_resa)} à {formaterHeure(reservation.heure_resa)}
          </p>
          <p className="text-sm text-gray-500">{reservation.nb_personnes} personne(s)</p>
        </div>
      </div>

      {reservation.message && (
        <p className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          « {reservation.message} »
        </p>
      )}

      <p className="mt-3 text-xs text-gray-400">
        Demandée le {formaterDateDemande(reservation.cree_le)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {reservation.statut === "en_attente" && (
          <>
            <button
              type="button"
              onClick={() => agir("confirmer")}
              disabled={enCours !== null}
              className="min-h-11 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {enCours === "confirmer" ? "Confirmation..." : "Confirmer"}
            </button>
            <button
              type="button"
              onClick={() => agir("refuser")}
              disabled={enCours !== null}
              className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {enCours === "refuser" ? "Refus..." : "Refuser"}
            </button>
          </>
        )}

        <a
          href={lienWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:brightness-110"
          style={{ background: "#25D366" }}
        >
          Répondre sur WhatsApp
        </a>
      </div>
    </div>
  );
}
