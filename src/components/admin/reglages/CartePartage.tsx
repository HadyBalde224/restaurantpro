"use client";

import { useEffect, useMemo, useState } from "react";
import qrcode from "qrcode-generator";
import EnteteCarte from "@/components/admin/reglages/EnteteCarte";
import { IconePartage } from "@/components/admin/Icones";
import type { Restaurant } from "@/lib/types";

// Zone de silence standard autour d'un QR code : 4 modules, sous peine de
// lecture peu fiable par certains lecteurs de caméra.
const MARGE_MODULES = 4;

// Rendu manuel en JSX (pas de dangerouslySetInnerHTML) : chaque module sombre
// devient un <rect>, à partir de la matrice calculée par qrcode-generator.
function QRCodeSvg({
  qr,
  taille,
}: {
  qr: ReturnType<typeof qrcode>;
  taille: number;
}) {
  const nbModules = qr.getModuleCount();
  const cote = nbModules + MARGE_MODULES * 2;
  const modules: [number, number][] = [];
  for (let ligne = 0; ligne < nbModules; ligne++) {
    for (let colonne = 0; colonne < nbModules; colonne++) {
      if (qr.isDark(ligne, colonne)) modules.push([colonne + MARGE_MODULES, ligne + MARGE_MODULES]);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${cote} ${cote}`}
      width={taille}
      height={taille}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code vers le site du restaurant"
    >
      <rect width={cote} height={cote} fill="#fff" />
      {modules.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#000" />
      ))}
    </svg>
  );
}

export default function CartePartage({ restaurant }: { restaurant: Restaurant }) {
  const [origine, setOrigine] = useState("");
  const [copie, setCopie] = useState(false);

  // window n'existe pas côté serveur : on récupère l'origine après le
  // montage, comme pour les autres cartes de Réglages (évite un décalage
  // d'hydratation).
  useEffect(() => {
    setOrigine(window.location.origin);
  }, []);

  const url = origine ? `${origine}/${restaurant.slug}` : "";

  const qr = useMemo(() => {
    if (!url) return null;
    const instance = qrcode(0, "M");
    instance.addData(url);
    instance.make();
    return instance;
  }, [url]);

  const copierLien = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  const telechargerQRCode = () => {
    if (!qr) return;
    const nbModules = qr.getModuleCount();
    const cellSize = Math.max(1, Math.round(1000 / (nbModules + MARGE_MODULES * 2)));
    const marge = cellSize * MARGE_MODULES;
    const taille = nbModules * cellSize + marge * 2;

    const canvas = document.createElement("canvas");
    canvas.width = taille;
    canvas.height = taille;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, taille, taille);
    ctx.translate(marge, marge);
    qr.renderTo2dContext(ctx, cellSize);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const lien = document.createElement("a");
      lien.href = URL.createObjectURL(blob);
      lien.download = `qr-code-${restaurant.slug}.png`;
      lien.click();
      URL.revokeObjectURL(lien.href);
    }, "image/png");
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <EnteteCarte icone={IconePartage} couleur="text-teal-600" fond="bg-teal-50" titre="Partagez votre site" />

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-center justify-center rounded-xl border border-gray-200 p-3">
          {qr ? (
            <QRCodeSvg qr={qr} taille={160} />
          ) : (
            <div className="h-40 w-40 animate-pulse rounded-lg bg-gray-100" />
          )}
        </div>

        <div className="w-full min-w-0 flex-1">
          <p className="text-sm text-gray-600">
            Imprimez ce code sur vos menus ou votre vitrine : vos clients le scannent avec leur
            téléphone pour accéder directement à votre site.
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <code className="min-w-0 flex-1 truncate text-sm text-gray-700">
              {url || "Chargement…"}
            </code>
            <button
              type="button"
              onClick={copierLien}
              disabled={!url}
              className="min-h-9 shrink-0 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {copie ? "Copié ✓" : "Copier"}
            </button>
          </div>

          <button
            type="button"
            onClick={telechargerQRCode}
            disabled={!qr}
            style={{ background: "var(--accent)", color: "var(--primaire)" }}
            className="mt-4 min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90 disabled:opacity-60"
          >
            Télécharger le QR code
          </button>
        </div>
      </div>
    </section>
  );
}
