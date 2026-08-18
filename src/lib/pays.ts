// Déduit l'indicatif téléphonique du pays à partir de la devise du restaurant.
// Volontairement limité à Guinée/Maroc (portée V1 du produit, cf. CLAUDE.md) —
// les autres devises (ex: CFA, partagée par plusieurs pays) n'ont pas
// d'indicatif unique déductible, donc pas de formatage imposé pour elles.
export function indicatifPays(devise: string): string | null {
  if (devise === "DH") return "212";
  if (devise === "GNF") return "224";
  return null;
}
