import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { PhotoGalerie } from "@/lib/types";
import { IconeGalerie } from "@/components/admin/Icones";
import GalerieAdmin from "@/components/admin/galerie/GalerieAdmin";

export default async function PageGalerieAdmin() {
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

  const [{ data: restaurant }, { data: photos, error: erreurPhotos }] = await Promise.all([
    supabase.from("restaurants").select("nom").eq("id", profil.restaurant_id).single(),
    supabase
      .from("photos_galerie")
      .select("*")
      .eq("restaurant_id", profil.restaurant_id)
      .order("ordre")
      .returns<PhotoGalerie[]>(),
  ]);

  if (erreurPhotos) console.error("Erreur chargement galerie :", erreurPhotos);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--accent)", color: "var(--primaire)" }}
        >
          <IconeGalerie size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galerie</h1>
          <p className="mt-1 text-gray-500">
            Les photos de votre restaurant, affichées dans une galerie sur votre site public.
          </p>
        </div>
      </div>

      <GalerieAdmin
        restaurantId={profil.restaurant_id}
        nom={restaurant?.nom ?? ""}
        photosInitiales={photos ?? []}
      />
    </div>
  );
}
