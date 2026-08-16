"use client";

import { usePathname } from "next/navigation";

const TITRES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/menu": "Menu",
  "/admin/reservations": "Réservations",
  "/admin/avis": "Avis",
  "/admin/reglages": "Réglages",
};

export default function EnteteContenu({ nom }: { nom: string }) {
  const pathname = usePathname();
  const titre = TITRES[pathname] ?? "";
  const initiale = nom.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
      <h2 className="text-lg font-semibold text-gray-900">{titre}</h2>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-medium text-gray-600 sm:inline">{nom}</span>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: "var(--primaire)" }}
        >
          {initiale}
        </div>
      </div>
    </div>
  );
}
