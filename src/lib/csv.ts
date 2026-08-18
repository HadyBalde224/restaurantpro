// Échappement CSV minimal (RFC 4180) : entoure de guillemets dès qu'une
// cellule contient une virgule, un guillemet ou un retour à la ligne, et
// double les guillemets internes.
function celluleCSV(valeur: unknown): string {
  const texte = valeur === null || valeur === undefined ? "" : String(valeur);
  if (/[",\n\r]/.test(texte)) {
    return `"${texte.replace(/"/g, '""')}"`;
  }
  return texte;
}

export function versCSV(colonnes: string[], lignes: unknown[][]): string {
  const entete = colonnes.map(celluleCSV).join(",");
  const corps = lignes.map((ligne) => ligne.map(celluleCSV).join(","));
  // BOM UTF-8 en tête : sans lui, Excel (très utilisé par nos restaurateurs)
  // affiche les accents français comme des caractères corrompus.
  return "﻿" + [entete, ...corps].join("\r\n");
}
