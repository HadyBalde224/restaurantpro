"use client";

import { useState } from "react";
import { exporterMenuCSV, exporterReservationsCSV } from "@/app/admin/(protege)/reglages/actions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconeTelechargement } from "@/components/admin/Icones";

function telechargerCSV(contenu: string, nomFichier: string) {
  const blob = new Blob([contenu], { type: "text/csv;charset=utf-8;" });
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(blob);
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(lien.href);
}

export default function CarteExport({ slug }: { slug: string }) {
  const [enCours, setEnCours] = useState<"menu" | "reservations" | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const exporter = async (type: "menu" | "reservations") => {
    setEnCours(type);
    setErreur(null);

    const resultat = type === "menu" ? await exporterMenuCSV() : await exporterReservationsCSV();

    if (!resultat.succes) {
      setErreur(resultat.message);
    } else {
      const date = new Date().toISOString().slice(0, 10);
      telechargerCSV(resultat.contenu, `${type}-${slug}-${date}.csv`);
    }

    setEnCours(null);
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconeTelechargement} couleur="text-cyan-600" fond="bg-cyan-50" titre="Export de vos données" />
      <p className="mt-1 text-sm text-gray-500">
        Téléchargez vos données à tout moment, au format CSV (ouvrable dans Excel).
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => exporter("menu")}
          disabled={enCours !== null}
          className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          {enCours === "menu" ? "Génération…" : "Télécharger le menu (CSV)"}
        </button>
        <button
          type="button"
          onClick={() => exporter("reservations")}
          disabled={enCours !== null}
          className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          {enCours === "reservations" ? "Génération…" : "Télécharger les réservations (CSV)"}
        </button>
      </div>

      {erreur && <p className="mt-3 text-sm font-medium text-red-600">{erreur}</p>}
    </section>
  );
}
