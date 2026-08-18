import type { NextConfig } from "next";

// Un seul projet Supabase sert TOUS les restaurants (architecture multi-tenant :
// une base, N clients) — le hostname du bucket de stockage est donc toujours le même,
// pas besoin de wildcard.
const hostnameSupabase = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  // Next.js bloque par défaut les requêtes cross-origin vers le serveur de dev
  // (protection anti-DNS-rebinding). Sans ça, tester depuis un téléphone via
  // l'IP locale du PC (ex: http://192.168.1.7:3000) fait échouer silencieusement
  // le chargement de plusieurs bundles JS (403) : l'app charge en apparence mais
  // l'hydratation React est cassée par endroits (animations, boutons inertes...).
  // L'IP vient de DEV_LAN_IP (.env.local, jamais commité) plutôt que d'être en
  // dur ici : elle est propre à chaque machine de développement.
  allowedDevOrigins: process.env.DEV_LAN_IP ? [process.env.DEV_LAN_IP] : [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: hostnameSupabase,
      },
    ],
    // Sur cette machine, la résolution DNS de *.supabase.co renvoie une adresse IPv6
    // synthétisée NAT64 (préfixe 64:ff9b::/96) que Next.js classe par erreur comme IP
    // privée (protection anti-SSRF trop agressive) — alors qu'elle encode une vraie IP
    // publique Cloudflare. Sans risque ici : remotePatterns ci-dessus reste le vrai
    // filtre (seulement Unsplash + notre propre projet Supabase sont autorisés).
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
