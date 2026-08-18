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
    .select("restaurant_id, nom_complet, role")
    .eq("id", user.id)
    .single();

  if (!profil) redirect("/admin/login");

  const estSuperAdmin = profil.role === "super_admin";

  // Le super-admin n'a pas de restaurant_id : on ne tente la requête que
  // pour un profil restaurateur normal, sinon .eq("id", null) ne renverrait
  // simplement rien d'utile.
  const { data: restaurant } = profil.restaurant_id
    ? await supabase
        .from("restaurants")
        .select("*")
        .eq("id", profil.restaurant_id)
        .single<Restaurant>()
    : { data: null };

  const nomAffiche = estSuperAdmin ? "NEHMA" : (restaurant?.nom ?? "");

  const variablesTheme = {
    "--primaire": restaurant?.couleur_primaire ?? "#171717",
    "--accent": restaurant?.couleur_accent ?? "#171717",
  } as CSSProperties;

  return (
    <div className="zone-admin min-h-screen bg-gray-50" style={variablesTheme}>
      <Sidebar
        nom={nomAffiche}
        nomComplet={profil.nom_complet ?? ""}
        role={profil.role ?? "admin"}
        logoUrl={restaurant?.logo_url}
      />
      <div className="lg:pl-60">
        <EnteteContenu nom={nomAffiche} />
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </div>
    </div>
  );
}
