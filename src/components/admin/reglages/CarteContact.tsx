"use client";

import { useState, type FormEvent } from "react";
import { enregistrerContact } from "@/app/admin/(protege)/reglages/actions";
import BarreActions from "@/components/admin/reglages/BarreActions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconeTelephone } from "@/components/admin/Icones";
import type { Restaurant } from "@/lib/types";

export default function CarteContact({ restaurant }: { restaurant: Restaurant }) {
  const [telephone, setTelephone] = useState(restaurant.telephone);
  const [whatsapp, setWhatsapp] = useState(restaurant.whatsapp);
  const [email, setEmail] = useState(restaurant.email);
  const [adresse, setAdresse] = useState(restaurant.adresse);
  const [ville, setVille] = useState(restaurant.ville);
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    const resultat = await enregistrerContact({ telephone, whatsapp, email, adresse, ville });
    setEnCours(false);
    setMessage({ texte: resultat.succes ? "✓ Enregistré" : resultat.message, erreur: !resultat.succes });
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconeTelephone} couleur="text-blue-600" fond="bg-blue-50" titre="Informations de contact" />

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              id="telephone"
              type="tel"
              inputMode="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            <p className="mt-1 text-xs text-gray-400">Format international sans +, ex : 224620000000</p>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              id="adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              id="ville"
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <BarreActions enCours={enCours} message={message} />
      </form>
    </section>
  );
}
