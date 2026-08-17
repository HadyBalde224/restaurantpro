"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", profil.restaurant_id)
    .single();
  if (!restaurant) return null;

  return { supabase, restaurantId: profil.restaurant_id, slug: restaurant.slug };
}

export async function creerAvisAdmin(donnees: {
  nomClient: string;
  note: number;
  commentaire: string;
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const nomClient = donnees.nomClient?.trim();
  const commentaire = donnees.commentaire?.trim();

  if (!Number.isInteger(donnees.note) || donnees.note < 1 || donnees.note > 5) {
    return { succes: false, message: "Merci de choisir une note entre 1 et 5 étoiles." };
  }
  if (!commentaire || commentaire.length < 5) {
    return { succes: false, message: "Le commentaire doit contenir au moins 5 caractères." };
  }

  // La policy RLS d'insertion n'autorise que approuve = false (elle est
  // pensée pour les visiteurs anonymes du site public). On insère donc
  // ainsi, puis on publie immédiatement via la policy UPDATE — le même
  // mécanisme qu'utilise déjà approuverAvis() ci-dessous.
  const { data: nouvelAvis, error: erreurInsertion } = await ctx.supabase
    .from("avis")
    .insert({
      restaurant_id: ctx.restaurantId,
      nom_client: nomClient || "Visiteur anonyme",
      note: donnees.note,
      commentaire,
      approuve: false,
    })
    .select("id")
    .single();

  if (erreurInsertion || !nouvelAvis) {
    console.error("Erreur création avis admin :", erreurInsertion);
    return { succes: false, message: "Impossible d'ajouter l'avis." };
  }

  const { error: erreurApprobation } = await ctx.supabase
    .from("avis")
    .update({ approuve: true })
    .eq("id", nouvelAvis.id)
    .eq("restaurant_id", ctx.restaurantId);

  if (erreurApprobation) {
    console.error("Erreur publication avis admin :", erreurApprobation);
    revalidatePath("/admin/avis");
    return {
      succes: true,
      message: "Avis ajouté, mais en attente de modération (approuvez-le manuellement).",
    };
  }

  revalidatePath(`/${ctx.slug}`);
  revalidatePath("/admin/avis");
  return { succes: true, message: "Avis ajouté et publié sur le site." };
}

export async function approuverAvis(avisId: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await ctx.supabase
    .from("avis")
    .update({ approuve: true })
    .eq("id", avisId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur approbation avis :", error);
    return { succes: false, message: "Impossible d'approuver l'avis." };
  }

  // Un avis approuvé devient visible sur le site public : on revalide les deux pages.
  revalidatePath(`/${ctx.slug}`);
  revalidatePath("/admin/avis");
  return { succes: true, message: "Avis publié sur le site." };
}

export async function depublierAvis(avisId: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await ctx.supabase
    .from("avis")
    .update({ approuve: false })
    .eq("id", avisId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur dépublication avis :", error);
    return { succes: false, message: "Impossible de dépublier l'avis." };
  }

  revalidatePath(`/${ctx.slug}`);
  revalidatePath("/admin/avis");
  return { succes: true, message: "Avis retiré du site." };
}

export async function supprimerAvis(avisId: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await ctx.supabase
    .from("avis")
    .delete()
    .eq("id", avisId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur suppression avis :", error);
    return { succes: false, message: "Impossible de supprimer l'avis." };
  }

  revalidatePath(`/${ctx.slug}`);
  revalidatePath("/admin/avis");
  return { succes: true, message: "Avis supprimé." };
}
