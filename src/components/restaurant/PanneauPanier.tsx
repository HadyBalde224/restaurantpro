"use client";

import { usePanier } from "@/components/restaurant/PanierContext";
import type { Restaurant } from "@/lib/types";

export default function PanneauPanier({
  restaurant,
  onFermer,
}: {
  restaurant: Restaurant;
  onFermer: () => void;
}) {
  const { lignes, changerQuantite, total } = usePanier();

  const envoyerCommandeWhatsApp = () => {
    const entete = `Bonjour ${restaurant.nom} ! Je souhaite commander :`;
    const details = lignes
      .map(
        (l) =>
          `• ${l.quantite} × ${l.plat.nom} — ${l.plat.prix * l.quantite} ${restaurant.devise}`
      )
      .join("\n");
    const pied = `Total : ${total} ${restaurant.devise}`;
    const message = `${entete}\n${details}\n${pied}`;

    const href = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-end sm:justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onFermer}
        aria-hidden="true"
      />

      <div className="relative flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:m-6 sm:max-h-[70vh] sm:w-96 sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-titre)" }}>
            Votre commande
          </h3>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="flex h-11 w-11 items-center justify-center text-2xl leading-none text-gray-400 transition-colors duration-200 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lignes.length === 0 ? (
            <p className="py-8 text-center text-gray-500">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-4">
              {lignes.map((l) => (
                <li key={l.plat.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{l.plat.nom}</p>
                    <p className="text-sm text-gray-500">
                      {l.plat.prix} {restaurant.devise} / unité
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => changerQuantite(l.plat.id, l.quantite - 1)}
                      aria-label="Diminuer la quantité"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition-colors duration-200 hover:bg-black/5"
                    >
                      −
                    </button>
                    <span className="w-5 text-center">{l.quantite}</span>
                    <button
                      type="button"
                      onClick={() => changerQuantite(l.plat.id, l.quantite + 1)}
                      aria-label="Augmenter la quantité"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 transition-colors duration-200 hover:bg-black/5"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lignes.length > 0 && (
          <div className="border-t border-black/5 px-6 py-4">
            <div className="mb-4 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span style={{ color: "var(--primaire)" }}>
                {total} {restaurant.devise}
              </span>
            </div>
            <button
              type="button"
              onClick={envoyerCommandeWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: "#25D366" }}
            >
              Envoyer la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
