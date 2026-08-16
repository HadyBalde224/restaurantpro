"use client";

import { useState } from "react";
import { usePanier } from "@/components/restaurant/PanierContext";
import type { Plat } from "@/lib/types";

export default function BoutonAjouterPanier({ plat }: { plat: Plat }) {
  const { ajouter } = usePanier();
  const [ajoute, setAjoute] = useState(false);

  const handleClick = () => {
    ajouter(plat);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-3 min-h-11 w-full rounded-full px-4 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
      style={{ background: "var(--accent)" }}
    >
      {ajoute ? "✓ Ajouté" : "+ Ajouter"}
    </button>
  );
}
