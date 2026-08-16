import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { CategorieMenu } from "@/lib/types";
import MenuAdmin from "@/components/admin/menu/MenuAdmin";

export default async function PageMenuAdmin() {
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

  const [
    { data: categories, error: erreurCategories },
    { data: restaurant, error: erreurRestaurant },
  ] = await Promise.all([
    supabase
      .from("categories_menu")
      .select("*, plats(*)")
      .eq("restaurant_id", profil.restaurant_id)
      .order("ordre")
      .returns<CategorieMenu[]>(),
    supabase.from("restaurants").select("devise").eq("id", profil.restaurant_id).single(),
  ]);

  if (erreurCategories) console.error("Erreur chargement menu admin :", erreurCategories);
  if (erreurRestaurant) console.error("Erreur chargement restaurant admin :", erreurRestaurant);

  return (
    <MenuAdmin
      categories={categories ?? []}
      restaurantId={profil.restaurant_id}
      devise={restaurant?.devise ?? "DH"}
    />
  );
}
