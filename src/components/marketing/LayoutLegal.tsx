import Link from "next/link";
import type { ReactNode } from "react";

export default function LayoutLegal({
  titre,
  misAJour,
  children,
}: {
  titre: string;
  misAJour: string;
  children: ReactNode;
}) {
  return (
    <div className="zone-marketing min-h-screen bg-(--fond)">
      <div className="mx-auto max-w-3xl px-6 pt-[max(4rem,calc(env(safe-area-inset-top)+2.5rem))] pb-24 sm:px-8 sm:pt-24">
        <Link
          href="/"
          className="flex min-h-11 items-center text-sm text-white/50 transition-colors duration-200 hover:text-white"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1
          className="mt-8 font-bold text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          {titre}
        </h1>
        <p className="mt-3 text-sm text-white/40">Dernière mise à jour : {misAJour}</p>

        <div className="mt-10 space-y-8 text-white/75">{children}</div>

        <p className="mt-16 text-xs text-white/30">
          © {new Date().getFullYear()} NEHMA. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
