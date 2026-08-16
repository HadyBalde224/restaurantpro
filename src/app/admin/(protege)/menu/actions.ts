"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ResultatAction = {
  succes: boolean;
  message: string;
};

// Appelé au début de CHAQUE action : vérifie la session et retrouve le
// restaurant de l'admin connecté. Toute action sans contexte valide s'arrête net.
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

function revaliderMenu(slug: string) {
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/menu");
}

// ============================================================================
// CATÉGORIES
// ============================================================================

export async function creerCategorie(nom: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const nomPropre = nom?.trim();
  if (!nomPropre || nomPropre.length < 2) {
    return { succes: false, message: "Le nom de la catégorie doit contenir au moins 2 caractères." };
  }

  const { count } = await ctx.supabase
    .from("categories_menu")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", ctx.restaurantId);

  const { error } = await ctx.supabase.from("categories_menu").insert({
    restaurant_id: ctx.restaurantId,
    nom: nomPropre,
    ordre: count ?? 0,
  });

  if (error) {
    console.error("Erreur création catégorie :", error);
    return { succes: false, message: "Impossible de créer la catégorie." };
  }

  revaliderMenu(ctx.slug);
  return { succes: true, message: "Catégorie créée." };
}

export async function renommerCategorie(categorieId: string, nom: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const nomPropre = nom?.trim();
  if (!nomPropre || nomPropre.length < 2) {
    return { succes: false, message: "Le nom de la catégorie doit contenir au moins 2 caractères." };
  }

  const { error } = await ctx.supabase
    .from("categories_menu")
    .update({ nom: nomPropre })
    .eq("id", categorieId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur renommage catégorie :", error);
    return { succes: false, message: "Impossible de renommer la catégorie." };
  }

  revaliderMenu(ctx.slug);
  return { succes: true, message: "Catégorie renommée." };
}

export async function supprimerCategorie(categorieId: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  // Le "on delete cascade" de la base supprime les plats de la catégorie automatiquement.
  const { error } = await ctx.supabase
    .from("categories_menu")
    .delete()
    .eq("id", categorieId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur suppression catégorie :", error);
    return { succes: false, message: "Impossible de supprimer la catégorie." };
  }

  revaliderMenu(ctx.slug);
  return { succes: true, message: "Catégorie et ses plats supprimés." };
}

export async function deplacerCategorie(
  categorieId: string,
  direction: "haut" | "bas"
): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { data: actuelle } = await ctx.supabase
    .from("categories_menu")
    .select("id, ordre")
    .eq("id", categorieId)
    .eq("restaurant_id", ctx.restaurantId)
    .single();
  if (!actuelle) return { succes: false, message: "Catégorie introuvable." };

  const requete = ctx.supabase
    .from("categories_menu")
    .select("id, ordre")
    .eq("restaurant_id", ctx.restaurantId);

  const { data: voisine } =
    direction === "haut"
      ? await requete.lt("ordre", actuelle.ordre).order("ordre", { ascending: false }).limit(1).maybeSingle()
      : await requete.gt("ordre", actuelle.ordre).order("ordre", { ascending: true }).limit(1).maybeSingle();

  if (!voisine) return { succes: true, message: "Déjà en position extrême." };

  await ctx.supabase.from("categories_menu").update({ ordre: voisine.ordre }).eq("id", actuelle.id);
  await ctx.supabase.from("categories_menu").update({ ordre: actuelle.ordre }).eq("id", voisine.id);

  revaliderMenu(ctx.slug);
  return { succes: true, message: "Ordre mis à jour." };
}

// ============================================================================
// PLATS
// ============================================================================

export async function enregistrerPlat(donnees: {
  id?: string; // présent = modification, absent = création
  nom: string;
  description: string;
  prix: number;
  categorieId: string;
  photoUrl: string | null;
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const nom = donnees.nom?.trim();
  if (!nom || nom.length < 2) {
    return { succes: false, message: "Le nom du plat doit contenir au moins 2 caractères." };
  }
  if (!Number.isFinite(donnees.prix) || donnees.prix < 0) {
    return { succes: false, message: "Le prix doit être un nombre positif." };
  }
  if (!donnees.categorieId) {
    return { succes: false, message: "Choisissez une catégorie." };
  }

  // La catégorie doit appartenir à CE restaurant — jamais confiance dans un id envoyé par le client.
  const { data: categorie } = await ctx.supabase
    .from("categories_menu")
    .select("id")
    .eq("id", donnees.categorieId)
    .eq("restaurant_id", ctx.restaurantId)
    .single();
  if (!categorie) return { succes: false, message: "Catégorie invalide." };

  // La photo doit provenir de NOTRE bucket Supabase, dans le dossier de CE restaurant.
  // On ne peut pas revalider ici le poids/type du fichier (il n'a jamais transité par le
  // serveur : l'upload se fait directement navigateur → Storage), mais on peut empêcher
  // qu'un appel forgé de cette action n'enregistre une URL d'image arbitraire.
  const prefixePhotoAutorise = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${ctx.restaurantId}/`;
  if (donnees.photoUrl && !donnees.photoUrl.startsWith(prefixePhotoAutorise)) {
    return { succes: false, message: "Image invalide." };
  }

  const description = donnees.description?.trim() ?? "";

  if (donnees.id) {
    const { error } = await ctx.supabase
      .from("plats")
      .update({
        nom,
        description,
        prix: donnees.prix,
        categorie_id: donnees.categorieId,
        photo_url: donnees.photoUrl,
      })
      .eq("id", donnees.id)
      .eq("restaurant_id", ctx.restaurantId);

    if (error) {
      console.error("Erreur modification plat :", error);
      return { succes: false, message: "Impossible d'enregistrer le plat." };
    }
  } else {
    const { count } = await ctx.supabase
      .from("plats")
      .select("*", { count: "exact", head: true })
      .eq("categorie_id", donnees.categorieId);

    const { error } = await ctx.supabase.from("plats").insert({
      restaurant_id: ctx.restaurantId,
      categorie_id: donnees.categorieId,
      nom,
      description,
      prix: donnees.prix,
      photo_url: donnees.photoUrl,
      disponible: true,
      ordre: count ?? 0,
    });

    if (error) {
      console.error("Erreur création plat :", error);
      return { succes: false, message: "Impossible de créer le plat." };
    }
  }

  revaliderMenu(ctx.slug);
  return { succes: true, message: donnees.id ? "Plat mis à jour." : "Plat ajouté." };
}

export async function supprimerPlat(platId: string): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await ctx.supabase
    .from("plats")
    .delete()
    .eq("id", platId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur suppression plat :", error);
    return { succes: false, message: "Impossible de supprimer le plat." };
  }

  revaliderMenu(ctx.slug);
  return { succes: true, message: "Plat supprimé." };
}

export async function changerDisponibilite(
  platId: string,
  disponible: boolean
): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return { succes: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await ctx.supabase
    .from("plats")
    .update({ disponible })
    .eq("id", platId)
    .eq("restaurant_id", ctx.restaurantId);

  if (error) {
    console.error("Erreur changement disponibilité :", error);
    return { succes: false, message: "Impossible de mettre à jour la disponibilité." };
  }

  revaliderMenu(ctx.slug);
  return { succes: true, message: disponible ? "Plat marqué disponible." : "Plat marqué épuisé." };
}
