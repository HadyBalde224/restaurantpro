import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Avis } from "@/lib/types";
import AvisAdmin from "@/components/admin/avis/AvisAdmin";

export default async function PageAvisAdmin() {
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

  const { data: avis, error } = await supabase
    .from("avis")
    .select("*")
    .eq("restaurant_id", profil.restaurant_id)
    .order("cree_le", { ascending: false })
    .returns<Avis[]>();

  if (error) console.error("Erreur chargement avis admin :", error);

  return <AvisAdmin avis={avis ?? []} />;
}
