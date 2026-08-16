import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Reservation } from "@/lib/types";
import ReservationsAdmin from "@/components/admin/reservations/ReservationsAdmin";

export default async function PageReservationsAdmin() {
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
    { data: reservations, error: erreurReservations },
    { data: restaurant, error: erreurRestaurant },
  ] = await Promise.all([
    supabase
      .from("reservations")
      .select("*")
      .eq("restaurant_id", profil.restaurant_id)
      .order("date_resa", { ascending: true })
      .order("heure_resa", { ascending: true })
      .returns<Reservation[]>(),
    supabase.from("restaurants").select("nom, devise").eq("id", profil.restaurant_id).single(),
  ]);

  if (erreurReservations) console.error("Erreur chargement réservations :", erreurReservations);
  if (erreurRestaurant) console.error("Erreur chargement restaurant :", erreurRestaurant);

  return (
    <ReservationsAdmin
      reservations={reservations ?? []}
      nomRestaurant={restaurant?.nom ?? ""}
      devise={restaurant?.devise ?? "DH"}
    />
  );
}
