"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { limiteDebitDepassee, obtenirIpVisiteur } from "@/lib/rateLimit";

export type EtatAvis = {
  succes: boolean;
  message: string;
};

export async function creerAvis(
  _etatPrecedent: EtatAvis | null,
  formData: FormData
): Promise<EtatAvis> {
  // 0. Frein anti-spam basique : max 5 avis par IP par minute
  const ip = await obtenirIpVisiteur();
  if (limiteDebitDepassee(`avis:${ip}`, 5, 60_000)) {
    return { succes: false, message: "Trop de tentatives. Merci de réessayer dans une minute." };
  }

  // 1. Extraire les champs du formulaire
  const restaurant_id = formData.get("restaurant_id") as string;
  const slug = formData.get("slug") as string;
  const nom_client = ((formData.get("nom_client") as string) || "").trim();
  const note = Number(formData.get("note"));
  const commentaire = ((formData.get("commentaire") as string) || "").trim();

  // 2. Validation SERVEUR — jamais confiance au navigateur
  if (!Number.isInteger(note) || note < 1 || note > 5)
    return { succes: false, message: "Merci de choisir une note entre 1 et 5 étoiles." };
  if (!commentaire || commentaire.length < 5)
    return { succes: false, message: "Votre commentaire doit contenir au moins 5 caractères." };

  // 3. Insertion — la RLS force approuve = false quoi qu'on envoie
  const supabase = await createClient();
  const { error } = await supabase.from("avis").insert({
    restaurant_id,
    nom_client: nom_client || "Visiteur anonyme",
    note,
    commentaire,
    approuve: false,
  });

  if (error) {
    console.error("Erreur envoi avis :", error);
    return { succes: false, message: "Une erreur est survenue. Réessayez." };
  }

  if (slug) revalidatePath(`/${slug}`);

  return {
    succes: true,
    message: "Merci pour votre avis ! Il sera visible après vérification par le restaurant.",
  };
}
