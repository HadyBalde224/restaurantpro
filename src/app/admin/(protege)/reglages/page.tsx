import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Restaurant } from "@/lib/types";
import CarteIdentite from "@/components/admin/reglages/CarteIdentite";
import CarteContact from "@/components/admin/reglages/CarteContact";
import CarteHoraires from "@/components/admin/reglages/CarteHoraires";
import CarteApparence from "@/components/admin/reglages/CarteApparence";
import CarteReseauxSociaux from "@/components/admin/reglages/CarteReseauxSociaux";
import CarteLocalisation from "@/components/admin/reglages/CarteLocalisation";

export default async function PageReglagesAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();
  if (!profil) redirect("/admin/login");

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", profil.restaurant_id)
    .single<Restaurant>();

  if (error) console.error("Erreur chargement réglages :", error);
  if (!restaurant) redirect("/admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Réglages</h1>
        <p className="mt-1 text-gray-500">Personnalisez les informations de votre restaurant.</p>
      </div>

      <CarteIdentite restaurant={restaurant} />
      <CarteContact restaurant={restaurant} />
      <CarteHoraires horaires={restaurant.horaires} />
      <CarteApparence restaurant={restaurant} />
      <CarteReseauxSociaux restaurant={restaurant} />
      <CarteLocalisation restaurant={restaurant} />
    </div>
  );
}
