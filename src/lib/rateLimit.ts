import { headers } from "next/headers";

const compteurs = new Map<string, number[]>();

// Adresse IP du visiteur, telle que transmise par le proxy/hébergeur en amont
// (Vercel, etc.) — jamais fournie par le client lui-même.
export async function obtenirIpVisiteur(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "inconnue";
}

// Limiteur de débit basique en mémoire : un frein contre le spam automatisé
// sur les formulaires publics (réservation, avis), pas une solution distribuée.
// Repose sur l'instance Node en cours — se réinitialise à chaque redémarrage et
// n'est pas partagé entre plusieurs instances. Suffisant pour un déploiement
// mono-instance ; prévoir un store partagé (Redis, Upstash...) si l'app tourne
// un jour derrière plusieurs instances serverless simultanées.
export function limiteDebitDepassee(cle: string, maxRequetes = 5, fenetreMs = 60_000): boolean {
  const maintenant = Date.now();
  const horodatages = (compteurs.get(cle) ?? []).filter((t) => maintenant - t < fenetreMs);

  if (horodatages.length >= maxRequetes) {
    compteurs.set(cle, horodatages);
    return true;
  }

  horodatages.push(maintenant);
  compteurs.set(cle, horodatages);
  return false;
}
