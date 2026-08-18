// Génère un identifiant unique sans dépendre de crypto.randomUUID(), qui
// n'existe que dans un "contexte sécurisé" (HTTPS ou localhost strict) —
// indisponible sur Safari/iOS quand le site est testé via l'IP locale en
// HTTP (ex: réseau WiFi pendant le développement). Pas besoin de garanties
// cryptographiques ici : juste de l'unicité pour des clés React et des noms
// de fichiers.
export function idUnique(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
