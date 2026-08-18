"use client";

import { useState, type FormEvent } from "react";
import { enregistrerHoraires } from "@/app/admin/(protege)/reglages/actions";
import BarreActions from "@/components/admin/reglages/BarreActions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconeHorloge } from "@/components/admin/Icones";

const JOURS: { id: string; libelle: string }[] = [
  { id: "lundi", libelle: "Lundi" },
  { id: "mardi", libelle: "Mardi" },
  { id: "mercredi", libelle: "Mercredi" },
  { id: "jeudi", libelle: "Jeudi" },
  { id: "vendredi", libelle: "Vendredi" },
  { id: "samedi", libelle: "Samedi" },
  { id: "dimanche", libelle: "Dimanche" },
];

export default function CarteHoraires({ horaires }: { horaires: Record<string, string> }) {
  const [valeurs, setValeurs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const { id } of JOURS) init[id] = horaires[id] ?? "";
    return init;
  });
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const modifierJour = (jour: string, valeur: string) => {
    setValeurs((v) => ({ ...v, [jour]: valeur }));
  };

  const basculerFerme = (jour: string) => {
    setValeurs((v) => ({ ...v, [jour]: v[jour] === "Fermé" ? "" : "Fermé" }));
  };

  const copierLundiPartout = () => {
    setValeurs((v) => {
      const suivant = { ...v };
      for (const { id } of JOURS) suivant[id] = v.lundi;
      return suivant;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    const resultat = await enregistrerHoraires(valeurs);
    setEnCours(false);
    setMessage({ texte: resultat.succes ? "✓ Enregistré" : resultat.message, erreur: !resultat.succes });
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EnteteCarte icone={IconeHorloge} couleur="text-orange-600" fond="bg-orange-50" titre="Horaires" />
        <button
          type="button"
          onClick={copierLundiPartout}
          className="min-h-11 rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100"
        >
          Copier lundi sur toute la semaine
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {JOURS.map(({ id, libelle }) => {
          const ferme = valeurs[id] === "Fermé";
          return (
            <div key={id} className="flex flex-wrap items-center justify-between gap-3">
              <span className="order-1 w-24 shrink-0 text-sm font-medium text-gray-700">{libelle}</span>
              <input
                type="text"
                value={ferme ? "Fermé" : valeurs[id]}
                onChange={(e) => modifierJour(id, e.target.value)}
                disabled={ferme}
                placeholder="Ex. 11h30 – 23h00"
                className="order-3 w-full min-w-0 rounded-xl border border-gray-300 px-4 py-2 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-50 disabled:text-gray-400 sm:order-2 sm:w-auto sm:flex-1"
              />
              <div className="order-2 flex shrink-0 items-center gap-2 text-sm text-gray-600 sm:order-3">
                <button
                  type="button"
                  onClick={() => basculerFerme(id)}
                  aria-pressed={ferme}
                  aria-label={`Marquer ${libelle} comme fermé`}
                  className="flex h-11 w-11 items-center justify-center"
                >
                  <span
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                      ferme ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        ferme ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </span>
                </button>
                Fermé
              </div>
            </div>
          );
        })}

        <BarreActions enCours={enCours} message={message} />
      </form>
    </section>
  );
}
