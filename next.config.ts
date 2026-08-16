import type { NextConfig } from "next";

// Un seul projet Supabase sert TOUS les restaurants (architecture multi-tenant :
// une base, N clients) — le hostname du bucket de stockage est donc toujours le même,
// pas besoin de wildcard.
const hostnameSupabase = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
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
