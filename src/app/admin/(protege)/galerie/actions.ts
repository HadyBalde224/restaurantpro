"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ResultatAction = {
  succes: boolean;
  message: string;
};

const MAX_PHOTOS = 12;

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

function echecSession(): ResultatAction {
  return { succes: false, message: "Session expirée. Reconnectez-vous." };
}

function revaliderGalerie(slug: string) {
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/galerie");
}

export async function ajouterPhoto(url: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  // La photo doit provenir de NOTRE bucket, dans le dossier de CE restaurant —
  // jamais confiance dans une URL envoyée par le client (même schéma que
  // l'apparence : voir CarteApparence.tsx).
  const prefixeAutorise = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${ctx.restaurantId}/`;
  if (!url.startsWith(prefixeAutorise)) {
    return { succes: false, message: "Photo invalide." };
  }

  const { count } = await ctx.supabase
    .from("photos_galerie")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", ctx.restaurantId);

  if ((count ?? 0) >= MAX_PHOTOS) {
    return { succes: false, message: `${MAX_PHOTOS} photos maximum dans la galerie.` };
  }

  const { error } = await ctx.supabase.from("photos_galerie").insert({
    restaurant_id: ctx.restaurantId,
    url,
    legende: "",
    ordre: count ?? 0,
  });

  if (error) {
    console.error("Erreur ajout photo galerie :", error);
    return { succes: false, message: "Impossible d'ajouter la photo." };
  }

  revaliderGalerie(ctx.slug);
  return { succes: true, message: "Photo ajoutée." };
}

export async function supprimerPhoto(id: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const { data: photo } = await ctx.supabase
    .from("photos_galerie")
    .select("url")
    .eq("id", id)
    .eq("restaurant_id", ctx.restaurantId)
    .single();

  const { error } = await ctx.supabase
    .from("photos_galerie")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur suppression photo galerie :", error);
    return { succes: false, message: "Impossible de supprimer la photo." };
  }

  if (photo?.url) {
    const marqueur = "/object/public/images/";
    const index = photo.url.indexOf(marqueur);
    if (index !== -1) {
      const chemin = photo.url.slice(index + marqueur.length);
      await ctx.supabase.storage.from("images").remove([chemin]);
    }
  }

  revaliderGalerie(ctx.slug);
  return { succes: true, message: "Photo supprimée." };
}

export async function modifierLegende(id: string, legende: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const { error } = await ctx.supabase
    .from("photos_galerie")
    .update({ legende: legende.trim().slice(0, 120) })
    .eq("id", id)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur modification légende :", error);
    return { succes: false, message: "Impossible d'enregistrer la légende." };
  }

  revaliderGalerie(ctx.slug);
  return { succes: true, message: "Légende enregistrée." };
}

export async function reordonnerPhotos(idsDansLOrdre: string[]): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  // Une requête par photo : le volume (max 12) rend un vrai batch/RPC
  // superflu ici.
  for (let i = 0; i < idsDansLOrdre.length; i++) {
    const { error } = await ctx.supabase
      .from("photos_galerie")
      .update({ ordre: i })
      .eq("id", idsDansLOrdre[i])
      .eq("restaurant_id", ctx.restaurantId);
    if (error) {
      console.error("Erreur réordonnancement galerie :", error);
      return { succes: false, message: "Impossible de réordonner les photos." };
    }
  }

  revaliderGalerie(ctx.slug);
  return { succes: true, message: "Ordre enregistré." };
}
