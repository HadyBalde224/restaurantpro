"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StatutReservation } from "@/lib/types";

export type ResultatAction = {
  succes: boolean;
  message: string;
};

async function getContexteAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();
  if (!profil) return null;

  return { supabase, restaurantId: profil.restaurant_id };
}

async function changerStatutReservation(
  reservationId: string,
  statut: Extract<StatutReservation, "confirmee" | "refusee">
): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await ctx.supabase
    .from("reservations")
    .update({ statut })
    .eq("id", reservationId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur changement statut réservation :", error);
    return { succes: false, message: "Impossible de mettre à jour la réservation." };
  }

  // Les réservations ne sont jamais visibles sur le site public :
  // seule la page admin a besoin d'être revalidée.
  revalidatePath("/admin/reservations");
  return {
    succes: true,
    message: statut === "confirmee" ? "Réservation confirmée." : "Réservation refusée.",
  };
}

export async function confirmerReservation(reservationId: string): Promise<ResultatAction> {
  return changerStatutReservation(reservationId, "confirmee");
}

export async function refuserReservation(reservationId: string): Promise<ResultatAction> {
  return changerStatutReservation(reservationId, "refusee");
}
