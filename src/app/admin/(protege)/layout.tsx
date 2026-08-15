import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Restaurant } from "@/lib/types";
import BoutonDeconnexion from "@/components/admin/BoutonDeconnexion";

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("restaurant_id, nom_complet")
    .eq("id", user.id)
    .single();

  if (!profil) redirect("/admin/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", profil.restaurant_id)
    .single<Restaurant>();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-lg">{restaurant?.nom}</p>
          <p className="text-sm text-gray-500">Espace de gestion</p>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm font-medium">
            <a href="/admin">Tableau de bord</a>
            <a href="/admin/menu">Menu</a>
            <a href="/admin/reservations">Réservations</a>
            <a href="/admin/avis">Avis</a>
            <a href="/admin/reglages">Réglages</a>
          </nav>
          <BoutonDeconnexion />
        </div>
      </header>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
