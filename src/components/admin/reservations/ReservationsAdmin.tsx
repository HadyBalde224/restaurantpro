"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/types";
import CarteReservation from "@/components/admin/reservations/CarteReservation";

type Onglet = "en_attente" | "confirmee" | "refusee" | "passees";

function estPassee(dateResa: string): boolean {
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  return new Date(dateResa) < aujourdhui;
}

export default function ReservationsAdmin({
  reservations,
  nomRestaurant,
  devise,
}: {
  reservations: Reservation[];
  nomRestaurant: string;
  devise: string;
}) {
  const [onglet, setOnglet] = useState<Onglet>("en_attente");
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const afficherMessage = (texte: string, erreur = false) => {
    setMessage({ texte, erreur });
    setTimeout(() => setMessage(null), 4000);
  };

  const groupes = useMemo(() => {
    const g: Record<Onglet, Reservation[]> = {
      en_attente: [],
      confirmee: [],
      refusee: [],
      passees: [],
    };
    for (const r of reservations) {
      if (estPassee(r.date_resa)) {
        g.passees.push(r);
      } else if (r.statut === "en_attente") {
        g.en_attente.push(r);
      } else if (r.statut === "confirmee") {
        g.confirmee.push(r);
      } else if (r.statut === "refusee") {
        g.refusee.push(r);
      }
    }
    return g;
  }, [reservations]);

  const onglets: { id: Onglet; libelle: string }[] = [
    { id: "en_attente", libelle: "En attente" },
    { id: "confirmee", libelle: "Confirmées" },
    { id: "refusee", libelle: "Refusées" },
    { id: "passees", libelle: "Passées" },
  ];

  const listeActive = groupes[onglet];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
      <p className="mt-1 text-gray-500">Gérez les demandes de réservation de vos clients.</p>

      {message && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            message.erreur ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {message.texte}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-b border-black/5">
        {onglets.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOnglet(o.id)}
            className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
              onglet === o.id
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {o.libelle}
            {o.id === "en_attente" && groupes.en_attente.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                {groupes.en_attente.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {listeActive.length === 0 ? (
          <p className="py-10 text-center text-gray-400">Aucune réservation ici.</p>
        ) : (
          listeActive.map((r) => (
            <CarteReservation
              key={r.id}
              reservation={r}
              nomRestaurant={nomRestaurant}
              devise={devise}
              onMessage={afficherMessage}
            />
          ))
        )}
      </div>
    </div>
  );
}
