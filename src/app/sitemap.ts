import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const origine = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // RLS ne renvoie que les restaurants actifs aux visiteurs anonymes — un
  // restaurant suspendu (impayé) disparaît donc automatiquement du sitemap,
  // sans logique supplémentaire à écrire ici.
  const { data: restaurants, error } = await supabase.from("restaurants").select("slug");

  if (error) console.error("Erreur génération sitemap :", error);

  const pagesRestaurants: MetadataRoute.Sitemap = (restaurants ?? []).map((r) => ({
    url: `${origine}/${r.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: origine, changeFrequency: "monthly", priority: 1 },
    { url: `${origine}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${origine}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
    ...pagesRestaurants,
  ];
}
