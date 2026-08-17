"use client";

import { useState, type FormEvent } from "react";
import { enregistrerLocalisation } from "@/app/admin/(protege)/reglages/actions";
import BarreActions from "@/components/admin/reglages/BarreActions";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconeCarte } from "@/components/admin/Icones";
import type { Restaurant } from "@/lib/types";

export default function CarteLocalisation({ restaurant }: { restaurant: Restaurant }) {
  const [latitude, setLatitude] = useState(restaurant.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(restaurant.longitude?.toString() ?? "");
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<{ texte: string; erreur: boolean } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessage(null);
    const resultat = await enregistrerLocalisation({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
    setEnCours(false);
    setMessage({ texte: resultat.succes ? "✓ Enregistré" : resultat.message, erreur: !resultat.succes });
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconeCarte} couleur="text-red-600" fond="bg-red-50" titre="Localisation" />
      <a
        href="https://www.google.com/maps"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-sm text-blue-600 underline-offset-2 hover:underline"
      >
        Trouver mes coordonnées sur Google Maps →
      </a>
      <p className="mt-1 text-xs text-gray-400">
        Clic droit sur l&apos;emplacement de votre restaurant sur la carte, puis « Copier les
        coordonnées ».
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              inputMode="decimal"
              step="any"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              inputMode="decimal"
              step="any"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <BarreActions enCours={enCours} message={message} />
      </form>
    </section>
  );
}
