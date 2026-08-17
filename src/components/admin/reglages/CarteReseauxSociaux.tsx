"use client";

import { useState, type FormEvent } from "react";
import { enregistrerReseauxSociaux } from "@/app/admin/(protege)/reglages/actions";
import BarreActions from "@/components/admin/reglages/BarreActions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconePartage } from "@/components/admin/Icones";
import type { Restaurant } from "@/lib/types";

export default function CarteReseauxSociaux({ restaurant }: { restaurant: Restaurant }) {
  const [instagram, setInstagram] = useState(restaurant.instagram);
  const [facebook, setFacebook] = useState(restaurant.facebook);
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    const resultat = await enregistrerReseauxSociaux({ instagram, facebook });
    setEnCours(false);
    setMessage({ texte: resultat.succes ? "✓ Enregistré" : resultat.message, erreur: !resultat.succes });
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconePartage} couleur="text-green-600" fond="bg-green-50" titre="Réseaux sociaux" />

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              id="instagram"
              type="url"
              placeholder="https://instagram.com/..."
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
              Facebook
            </label>
            <input
              id="facebook"
              type="url"
              placeholder="https://facebook.com/..."
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <BarreActions enCours={enCours} message={message} />
      </form>
    </section>
  );
}
