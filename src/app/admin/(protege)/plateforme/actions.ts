"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ResultatAction = {
  succes: boolean;
  message: string;
};

const DEVISES_VALIDES = ["GNF", "DH", "CFA"];

async function getContextePlateforme() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profil || profil.role !== "super_admin") return null;

  return { supabase };
}

function echecSession(): ResultatAction {
  return { succes: false, message: "Session expirée ou accès non autorisé. Reconnectez-vous." };
}

function slugifier(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // retire les accents (é → e, etc.)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function verifierSlugDisponible(slug: string): Promise<{ disponible: boolean }> {
  const ctx = await getContextePlateforme();
  if (!ctx) return { disponible: false };

  const { data } = await ctx.supabase.from("restaurants").select("id").eq("slug", slug).maybeSingle();
  return { disponible: !data };
}

export type ResultatCreationRestaurant =
  | { succes: true; slug: string }
  | { succes: false; message: string };

export async function creerRestaurant(donnees: {
  nom: string;
  slug: string;
  ville: string;
  devise: string;
  whatsapp: string;
  email: string;
  motDePasse: string;
}): Promise<ResultatCreationRestaurant> {
  const ctx = await getContextePlateforme();
  if (!ctx) return { succes: false, message: "Session expirée ou accès non autorisé." };

  const nom = donnees.nom?.trim();
  const slug = slugifier(donnees.slug?.trim() ?? "");
  const ville = donnees.ville?.trim();
  const devise = donnees.devise?.trim();
  const whatsapp = donnees.whatsapp?.trim().replace(/\D/g, "");
  const email = donnees.email?.trim();
  const motDePasse = donnees.motDePasse ?? "";

  if (!nom || nom.length < 2) {
    return { succes: false, message: "Le nom du restaurant doit contenir au moins 2 caractères." };
  }
  if (!slug || slug.length < 2) {
    return { succes: false, message: "Le slug doit contenir au moins 2 caractères (lettres, chiffres, tirets)." };
  }
  if (!ville || ville.length < 2) {
    return { succes: false, message: "La ville est requise." };
  }
  if (!DEVISES_VALIDES.includes(devise)) {
    return { succes: false, message: "Devise invalide." };
  }
  if (!/^\d{10,15}$/.test(whatsapp)) {
    return { succes: false, message: "Le numéro WhatsApp doit contenir entre 10 et 15 chiffres, sans le +." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { succes: false, message: "L'adresse email n'est pas valide." };
  }
  if (motDePasse.length < 8) {
    return { succes: false, message: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const { data: slugExistant } = await ctx.supabase
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (slugExistant) {
    return { succes: false, message: "Ce slug est déjà utilisé par un autre restaurant." };
  }

  const { data: nouveauRestaurant, error: erreurRestaurant } = await ctx.supabase
    .from("restaurants")
    .insert({
      nom,
      slug,
      ville,
      devise,
      whatsapp,
      telephone: whatsapp,
      email,
      description: "",
      adresse: "",
      latitude: null,
      longitude: null,
      horaires: {},
      instagram: "",
      facebook: "",
      logo_url: null,
      photos_hero: [],
      // Deux couleurs distinctes par défaut : identiques, le bouton CTA et le
      // badge deviennent invisibles sur le dégradé de secours du hero tant
      // que le restaurant n'a ni photo ni couleurs personnalisées.
      couleur_primaire: "#1c1917",
      couleur_accent: "#c9a86a",
      actif: true,
    })
    .select("id")
    .single();

  if (erreurRestaurant || !nouveauRestaurant) {
    console.error("Erreur création restaurant :", erreurRestaurant);
    return { succes: false, message: "Impossible de créer le restaurant." };
  }

  const restaurantId = nouveauRestaurant.id;
  const adminClient = createAdminClient();

  const { data: nouvelUtilisateur, error: erreurUtilisateur } = await adminClient.auth.admin.createUser({
    email,
    password: motDePasse,
    email_confirm: true,
  });

  if (erreurUtilisateur || !nouvelUtilisateur.user) {
    console.error("Erreur création compte restaurateur :", erreurUtilisateur);
    await ctx.supabase.from("restaurants").delete().eq("id", restaurantId);
    return {
      succes: false,
      message: erreurUtilisateur?.message?.includes("already been registered")
        ? "Un compte existe déjà avec cet email."
        : "Impossible de créer le compte restaurateur.",
    };
  }

  const { error: erreurProfil } = await ctx.supabase.from("profils_admin").insert({
    id: nouvelUtilisateur.user.id,
    restaurant_id: restaurantId,
    nom_complet: nom,
    role: "admin",
  });

  if (erreurProfil) {
    console.error("Erreur création profil admin :", erreurProfil);
    await adminClient.auth.admin.deleteUser(nouvelUtilisateur.user.id);
    await ctx.supabase.from("restaurants").delete().eq("id", restaurantId);
    return { succes: false, message: "Impossible de relier le compte au restaurant." };
  }

  const { error: erreurAbonnement } = await ctx.supabase.from("abonnements").insert({
    restaurant_id: restaurantId,
    plan: "Standard",
    prix_mensuel: 0,
    paye_jusqu_au: null,
    notes: "",
  });

  if (erreurAbonnement) {
    // Le restaurant et le compte existent déjà et sont fonctionnels : on ne
    // fait pas tout annuler pour un abonnement manquant, l'admin pourra le
    // créer depuis la fiche du restaurant. On log juste l'erreur.
    console.error("Erreur création abonnement :", erreurAbonnement);
  }

  revalidatePath("/admin/plateforme");
  return { succes: true, slug };
}

export async function changerStatutRestaurant(
  restaurantId: string,
  actif: boolean
): Promise<ResultatAction> {
  const ctx = await getContextePlateforme();
  if (!ctx) return echecSession();

  const { data: restaurant, error: erreurLecture } = await ctx.supabase
    .from("restaurants")
    .select("slug")
    .eq("id", restaurantId)
    .single();

  if (erreurLecture || !restaurant) {
    return { succes: false, message: "Restaurant introuvable." };
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({ actif })
    .eq("id", restaurantId);

  if (error) {
    console.error("Erreur changement statut restaurant :", error);
    return { succes: false, message: "Impossible de mettre à jour le statut." };
  }

  revalidatePath(`/${restaurant.slug}`);
  revalidatePath("/admin/plateforme");
  revalidatePath(`/admin/plateforme/restaurants/${restaurantId}`);

  return { succes: true, message: actif ? "Restaurant activé." : "Restaurant suspendu." };
}

export async function enregistrerAbonnement(
  restaurantId: string,
  donnees: {
    plan: string;
    prixMensuel: number;
    payeJusquAu: string | null;
    notes: string;
  }
): Promise<ResultatAction> {
  const ctx = await getContextePlateforme();
  if (!ctx) return echecSession();

  if (!Number.isFinite(donnees.prixMensuel) || donnees.prixMensuel < 0) {
    return { succes: false, message: "Le prix mensuel doit être un nombre positif." };
  }

  // On ne suppose pas de contrainte unique sur restaurant_id en base : on
  // cherche la ligne existante nous-mêmes plutôt que de compter sur un
  // upsert(onConflict), pour éviter de dupliquer l'abonnement si elle n'existe pas.
  const { data: existant } = await ctx.supabase
    .from("abonnements")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  const valeurs = {
    restaurant_id: restaurantId,
    plan: donnees.plan?.trim() || "Standard",
    prix_mensuel: donnees.prixMensuel,
    paye_jusqu_au: donnees.payeJusquAu || null,
    notes: donnees.notes?.trim() ?? "",
  };

  const { error } = existant
    ? await ctx.supabase.from("abonnements").update(valeurs).eq("id", existant.id)
    : await ctx.supabase.from("abonnements").insert(valeurs);

  if (error) {
    console.error("Erreur enregistrement abonnement :", error);
    return { succes: false, message: "Impossible d'enregistrer l'abonnement." };
  }

  revalidatePath(`/admin/plateforme/restaurants/${restaurantId}`);
  revalidatePath("/admin/plateforme");

  return { succes: true, message: "Abonnement enregistré." };
}
