"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconeDashboard,
  IconeMenu,
  IconeCalendrier,
  IconeEtoile,
  IconeReglages,
  IconeBurger,
  IconeCroix,
  IconePlus,
} from "@/components/admin/Icones";
import BoutonDeconnexion from "@/components/admin/BoutonDeconnexion";
import type { RoleAdmin } from "@/lib/types";

const LIENS = [
  { href: "/admin", libelle: "Tableau de bord", Icone: IconeDashboard },
  { href: "/admin/menu", libelle: "Menu", Icone: IconeMenu },
  { href: "/admin/reservations", libelle: "Réservations", Icone: IconeCalendrier },
  { href: "/admin/avis", libelle: "Avis", Icone: IconeEtoile },
  { href: "/admin/reglages", libelle: "Réglages", Icone: IconeReglages },
];

const LIENS_PLATEFORME = [
  { href: "/admin/plateforme", libelle: "Tableau de bord", Icone: IconeDashboard },
  { href: "/admin/plateforme/restaurants/nouveau", libelle: "Nouveau restaurant", Icone: IconePlus },
];

function ContenuNav({
  pathname,
  onNaviguer,
  liens,
}: {
  pathname: string;
  onNaviguer?: () => void;
  liens: typeof LIENS;
}) {
  const estActif = (href: string) => (href === pathname ? true : href !== "/admin" && href !== "/admin/plateforme" && pathname.startsWith(href));

  return (
    <nav className="flex flex-col gap-1 px-3">
      {liens.map(({ href, libelle, Icone }) => {
        const actif = estActif(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNaviguer}
            aria-current={actif ? "page" : undefined}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200"
            style={actif ? { background: "var(--primaire)", color: "#fff" } : undefined}
          >
            <Icone size={18} className={actif ? "" : "text-gray-400"} />
            <span className={actif ? "" : "text-gray-700"}>{libelle}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function CompteConnecte({
  nom,
  nomComplet,
  estSuperAdmin,
}: {
  nom: string;
  nomComplet: string;
  estSuperAdmin: boolean;
}) {
  const libelle = nomComplet.trim() || nom;
  const initiale = libelle.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ background: "var(--primaire)" }}
      >
        {initiale}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{libelle}</p>
        <p className="text-xs text-gray-500">{estSuperAdmin ? "Super-admin" : "Propriétaire"}</p>
      </div>
    </div>
  );
}

export default function Sidebar({
  nom,
  nomComplet,
  role,
}: {
  nom: string;
  nomComplet: string;
  role: RoleAdmin;
}) {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();
  const estSuperAdmin = role === "super_admin";
  const liens = estSuperAdmin ? LIENS_PLATEFORME : LIENS;
  const sousTitre = estSuperAdmin ? "Administration de la plateforme" : "Espace de gestion";

  return (
    <>
      {/* Sidebar fixe desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-black/5 lg:bg-white">
        <div className="px-6 py-5">
          <p className="font-bold text-lg text-gray-900">{nom}</p>
          <p className="text-sm text-gray-500">{sousTitre}</p>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {estSuperAdmin && (
            <p className="px-6 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Plateforme
            </p>
          )}
          <ContenuNav pathname={pathname} liens={liens} />
        </div>

        <div className="border-t border-black/5 px-3 py-3">
          <CompteConnecte nom={nom} nomComplet={nomComplet} estSuperAdmin={estSuperAdmin} />
          <div className="mt-1 px-3">
            <BoutonDeconnexion />
          </div>
        </div>
      </aside>

      {/* Header simple mobile */}
      <header className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 lg:hidden">
        <div>
          <p className="font-bold text-gray-900">{nom}</p>
          <p className="text-xs text-gray-500">{sousTitre}</p>
        </div>
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-label="Ouvrir le menu"
          className="flex h-11 w-11 items-center justify-center text-gray-700"
        >
          <IconeBurger size={22} />
        </button>
      </header>

      {/* Drawer mobile */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          ouvert ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOuvert(false)}
          aria-hidden="true"
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 ${
            ouvert ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="font-bold text-gray-900">{nom}</p>
              <p className="text-sm text-gray-500">{sousTitre}</p>
            </div>
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label="Fermer le menu"
              className="flex h-11 w-11 items-center justify-center text-gray-700"
            >
              <IconeCroix size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {estSuperAdmin && (
              <p className="px-6 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Plateforme
              </p>
            )}
            <ContenuNav pathname={pathname} onNaviguer={() => setOuvert(false)} liens={liens} />
          </div>

          <div className="border-t border-black/5 px-3 py-3">
            <CompteConnecte nom={nom} nomComplet={nomComplet} estSuperAdmin={estSuperAdmin} />
            <div className="mt-1 px-3">
              <BoutonDeconnexion />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
