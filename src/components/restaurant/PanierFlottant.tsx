"use client";

import { useState } from "react";
import { usePanier } from "@/components/restaurant/PanierContext";
import PanneauPanier from "@/components/restaurant/PanneauPanier";
import type { Restaurant } from "@/lib/types";

export default function PanierFlottant({ restaurant }: { restaurant: Restaurant }) {
  const { nombreArticles, total } = usePanier();
  const [ouvert, setOuvert] = useState(false);
  const visible = nombreArticles > 0;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 transition-all duration-300 ease-out sm:bottom-6 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="flex w-full max-w-md items-center justify-between gap-4 rounded-full px-6 py-4 text-white shadow-xl transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: "var(--primaire)" }}
        >
          <span className="flex items-center gap-3 font-semibold">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--primaire)" }}
            >
              {nombreArticles}
            </span>
            {total} {restaurant.devise}
          </span>
          <span className="font-semibold">Voir ma commande</span>
        </button>
      </div>

      {ouvert && <PanneauPanier restaurant={restaurant} onFermer={() => setOuvert(false)} />}
    </>
  );
}
