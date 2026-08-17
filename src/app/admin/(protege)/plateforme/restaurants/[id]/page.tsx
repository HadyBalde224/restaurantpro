import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Abonnement, Restaurant } from "@/lib/types";
import FicheRestaurant from "@/components/admin/plateforme/FicheRestaurant";

export default async function PageFicheRestaurant({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: restaurant, error: erreurRestaurant }, { data: abonnement, error: erreurAbonnement }] =
    await Promise.all([
      supabase.from("restaurants").select("*").eq("id", id).single<Restaurant>(),
      supabase.from("abonnements").select("*").eq("restaurant_id", id).maybeSingle<Abonnement>(),
    ]);

  if (erreurAbonnement) console.error("Erreur chargement abonnement :", erreurAbonnement);
  if (erreurRestaurant || !restaurant) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{restaurant.nom}</h1>
      <p className="mt-1 text-gray-500">{restaurant.ville}</p>

      <div className="mt-8">
        <FicheRestaurant restaurant={restaurant} abonnement={abonnement} />
      </div>
    </div>
  );
}
