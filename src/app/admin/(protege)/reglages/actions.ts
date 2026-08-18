"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { versCSV } from "@/lib/csv";
import type { CategorieMenu, Reservation } from "@/lib/types";

export type ResultatAction = {
  succes: boolean;
  message: string;
};

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

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

function echecSession(): { succes: false; message: string } {
  return { succes: false, message: "Session expirée. Reconnectez-vous." };
}

function revaliderReglages(slug: string) {
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/reglages");
}

// ============================================================================
// IDENTITÉ
// ============================================================================

export async function enregistrerIdentite(donnees: {
  nom: string;
  description: string;
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const nom = donnees.nom?.trim();
  if (!nom || nom.length < 2) {
    return { succes: false, message: "Le nom du restaurant doit contenir au moins 2 caractères." };
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({ nom, description: donnees.description?.trim() ?? "" })
    .eq("id", ctx.restaurantId);

  if (error) {
    console.error("Erreur enregistrement identité :", error);
    return { succes: false, message: "Impossible d'enregistrer l'identité." };
  }

  revaliderReglages(ctx.slug);
  return { succes: true, message: "Identité enregistrée." };
}

// ============================================================================
// CONTACT
// ============================================================================

export async function enregistrerContact(donnees: {
  telephone: string;
  whatsapp: string;
  email: string;
  adresse: string;
  ville: string;
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const whatsapp = donnees.whatsapp?.trim() ?? "";
  if (!/^\d{10,15}$/.test(whatsapp)) {
    return {
      succes: false,
      message: "Le numéro WhatsApp doit contenir uniquement des chiffres (10 à 15), sans le +.",
    };
  }

  const email = donnees.email?.trim() ?? "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { succes: false, message: "L'adresse email n'est pas valide." };
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({
      telephone: donnees.telephone?.trim() ?? "",
      whatsapp,
      email,
      adresse: donnees.adresse?.trim() ?? "",
      ville: donnees.ville?.trim() ?? "",
    })
    .eq("id", ctx.restaurantId);

  if (error) {
    console.error("Erreur enregistrement contact :", error);
    return { succes: false, message: "Impossible d'enregistrer les coordonnées." };
  }

  revaliderReglages(ctx.slug);
  return { succes: true, message: "Coordonnées enregistrées." };
}

// ============================================================================
// HORAIRES
// ============================================================================

export async function enregistrerHoraires(horaires: Record<string, string>): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const horairesPropres: Record<string, string> = {};
  for (const jour of JOURS) {
    const valeur = horaires[jour];
    if (typeof valeur !== "string" || !valeur.trim()) {
      return { succes: false, message: `Merci de renseigner les horaires du ${jour}.` };
    }
    horairesPropres[jour] = valeur.trim();
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({ horaires: horairesPropres })
    .eq("id", ctx.restaurantId);

  if (error) {
    console.error("Erreur enregistrement horaires :", error);
    return { succes: false, message: "Impossible d'enregistrer les horaires." };
  }

  revaliderReglages(ctx.slug);
  return { succes: true, message: "Horaires enregistrés." };
}

// ============================================================================
// APPARENCE
// ============================================================================

export async function enregistrerApparence(donnees: {
  couleurPrimaire: string;
  couleurAccent: string;
  logoUrl: string | null;
  photosHero: string[];
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const regexHex = /^#[0-9A-Fa-f]{6}$/;
  if (!regexHex.test(donnees.couleurPrimaire) || !regexHex.test(donnees.couleurAccent)) {
    return { succes: false, message: "Couleur invalide." };
  }

  if (donnees.photosHero.length > 3) {
    return { succes: false, message: "3 photos de couverture maximum." };
  }

  // Les images doivent provenir de NOTRE bucket, dans le dossier de CE restaurant —
  // jamais confiance dans une URL envoyée par le client.
  const prefixeAutorise = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${ctx.restaurantId}/`;
  if (donnees.logoUrl && !donnees.logoUrl.startsWith(prefixeAutorise)) {
    return { succes: false, message: "Logo invalide." };
  }
  if (donnees.photosHero.some((url) => !url.startsWith(prefixeAutorise))) {
    return { succes: false, message: "Photo de couverture invalide." };
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({
      couleur_primaire: donnees.couleurPrimaire,
      couleur_accent: donnees.couleurAccent,
      logo_url: donnees.logoUrl,
      photos_hero: donnees.photosHero,
    })
    .eq("id", ctx.restaurantId);

  if (error) {
    console.error("Erreur enregistrement apparence :", error);
    return { succes: false, message: "Impossible d'enregistrer l'apparence." };
  }

  revaliderReglages(ctx.slug);
  return { succes: true, message: "Apparence enregistrée." };
}

// ============================================================================
// RÉSEAUX SOCIAUX
// ============================================================================

function urlSure(valeur: string): boolean {
  const v = valeur.trim();
  if (!v) return true;
  if (v.length > 200) return false;
  if (/^javascript:/i.test(v)) return false;
  return true;
}

export async function enregistrerReseauxSociaux(donnees: {
  instagram: string;
  facebook: string;
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const instagram = donnees.instagram?.trim() ?? "";
  const facebook = donnees.facebook?.trim() ?? "";

  if (!urlSure(instagram) || !urlSure(facebook)) {
    return { succes: false, message: "Lien invalide." };
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({ instagram, facebook })
    .eq("id", ctx.restaurantId);

  if (error) {
    console.error("Erreur enregistrement réseaux sociaux :", error);
    return { succes: false, message: "Impossible d'enregistrer les réseaux sociaux." };
  }

  revaliderReglages(ctx.slug);
  return { succes: true, message: "Réseaux sociaux enregistrés." };
}

// ============================================================================
// LOCALISATION
// ============================================================================

export async function enregistrerLocalisation(donnees: {
  latitude: number;
  longitude: number;
}): Promise<ResultatAction> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  if (!Number.isFinite(donnees.latitude) || donnees.latitude < -90 || donnees.latitude > 90) {
    return { succes: false, message: "Latitude invalide (entre -90 et 90)." };
  }
  if (!Number.isFinite(donnees.longitude) || donnees.longitude < -180 || donnees.longitude > 180) {
    return { succes: false, message: "Longitude invalide (entre -180 et 180)." };
  }

  const { error } = await ctx.supabase
    .from("restaurants")
    .update({ latitude: donnees.latitude, longitude: donnees.longitude })
    .eq("id", ctx.restaurantId);

  if (error) {
    console.error("Erreur enregistrement localisation :", error);
    return { succes: false, message: "Impossible d'enregistrer la localisation." };
  }

  revaliderReglages(ctx.slug);
  return { succes: true, message: "Localisation enregistrée." };
}

// ============================================================================
// EXPORT DE DONNÉES
// ============================================================================

export type ResultatExport = { succes: true; contenu: string } | { succes: false; message: string };

export async function exporterMenuCSV(): Promise<ResultatExport> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const { data, error } = await ctx.supabase
    .from("categories_menu")
    .select("nom, plats(nom, description, prix, disponible)")
    .eq("restaurant_id", ctx.restaurantId)
    .order("ordre")
    .returns<CategorieMenu[]>();

  if (error) {
    console.error("Erreur export menu :", error);
    return { succes: false, message: "Impossible de générer l'export du menu." };
  }

  const lignes = (data ?? []).flatMap((categorie) =>
    categorie.plats.map((plat) => [
      categorie.nom,
      plat.nom,
      plat.description,
      plat.prix,
      plat.disponible ? "oui" : "non",
    ])
  );

  return {
    succes: true,
    contenu: versCSV(["Catégorie", "Plat", "Description", "Prix", "Disponible"], lignes),
  };
}

export async function exporterReservationsCSV(): Promise<ResultatExport> {
  const ctx = await getContexteAdmin();
  if (!ctx) return echecSession();

  const { data, error } = await ctx.supabase
    .from("reservations")
    .select("*")
    .eq("restaurant_id", ctx.restaurantId)
    .order("date_resa", { ascending: false })
    .returns<Reservation[]>();

  if (error) {
    console.error("Erreur export réservations :", error);
    return { succes: false, message: "Impossible de générer l'export des réservations." };
  }

  const lignes = (data ?? []).map((r) => [
    r.nom_client,
    r.telephone,
    r.date_resa,
    r.heure_resa,
    r.nb_personnes,
    r.statut,
    r.message,
  ]);

  return {
    succes: true,
    contenu: versCSV(
      ["Nom", "Téléphone", "Date", "Heure", "Nombre de personnes", "Statut", "Message"],
      lignes
    ),
  };
}
