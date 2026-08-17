import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LayoutPlateforme({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profil || profil.role !== "super_admin") redirect("/admin");

  return <>{children}</>;
}
