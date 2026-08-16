import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Restaurant } from "@/lib/types";
import Sidebar from "@/components/admin/Sidebar";
import EnteteContenu from "@/components/admin/EnteteContenu";

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

  const variablesTheme = {
    "--primaire": restaurant?.couleur_primaire ?? "#171717",
    "--accent": restaurant?.couleur_accent ?? "#171717",
  } as CSSProperties;

  return (
    <div className="zone-admin min-h-screen bg-gray-50" style={variablesTheme}>
      <Sidebar nom={restaurant?.nom ?? ""} nomComplet={profil.nom_complet ?? ""} />
      <div className="lg:pl-60">
        <EnteteContenu nom={restaurant?.nom ?? ""} />
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </div>
    </div>
  );
}
