"use client";

import { useEffect, useState, type FormEvent } from "react";
import { enregistrerIdentite } from "@/app/admin/(protege)/reglages/actions";
import BarreActions from "@/components/admin/reglages/BarreActions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconeBoutique } from "@/components/admin/Icones";
import type { Restaurant } from "@/lib/types";

export default function CarteIdentite({ restaurant }: { restaurant: Restaurant }) {
  const [nom, setNom] = useState(restaurant.nom);
  const [description, setDescription] = useState(restaurant.description);
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);
  const [origine, setOrigine] = useState("");

  // window n'existe pas côté serveur : on récupère le domaine après le montage
  // pour éviter un décalage d'hydratation.
  useEffect(() => {
    setOrigine(window.location.origin);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    const resultat = await enregistrerIdentite({ nom, description });
    setEnCours(false);
    setMessage({ texte: resultat.succes ? "✓ Enregistré" : resultat.message, erreur: !resultat.succes });
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconeBoutique} couleur="text-purple-600" fond="bg-purple-50" titre="Identité du restaurant" />

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="nom_resto" className="block text-sm font-medium text-gray-700">
            Nom du restaurant
          </label>
          <input
            id="nom_resto"
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label htmlFor="description_resto" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description_resto"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700">Adresse de votre site</p>
          <p className="mt-1 rounded-xl bg-gray-50 px-4 py-2.5 text-gray-500">
            {origine || "…"}/{restaurant.slug}
          </p>
          <p className="mt-1 text-xs text-gray-400">Pour changer votre adresse web, contactez-nous.</p>
        </div>

        <BarreActions enCours={enCours} message={message} />
      </form>
    </section>
  );
}
