"use server";

import { createClient } from "@/lib/supabase/server";

export type EtatReservation = {
  succes: boolean;
  message: string;
};

export async function creerReservation(
  _etatPrecedent: EtatReservation | null,
  formData: FormData
): Promise<EtatReservation> {
  // 1. Extraire les champs du formulaire
  const restaurant_id = formData.get("restaurant_id") as string;
  const nom_client = (formData.get("nom_client") as string)?.trim();
  const telephone = (formData.get("telephone") as string)?.trim();
  const date_resa = formData.get("date_resa") as string;
  const heure_resa = formData.get("heure_resa") as string;
  const nb_personnes = Number(formData.get("nb_personnes"));
  const message = ((formData.get("message") as string) || "").trim();

  // 2. Validation SERVEUR — jamais confiance au navigateur
  if (!nom_client || nom_client.length < 2)
    return { succes: false, message: "Merci d'indiquer votre nom." };
  if (!telephone || telephone.replace(/\D/g, "").length < 8)
    return { succes: false, message: "Numéro de téléphone invalide." };
  if (!date_resa || new Date(date_resa) < new Date(new Date().toDateString()))
    return { succes: false, message: "La date doit être aujourd'hui ou plus tard." };
  if (!heure_resa)
    return { succes: false, message: "Merci de choisir une heure." };
  if (!nb_personnes || nb_personnes < 1 || nb_personnes > 50)
    return { succes: false, message: "Nombre de personnes entre 1 et 50." };

  // 3. Insertion — la RLS vérifie une dernière fois (resto actif, statut en_attente)
  const supabase = await createClient();
  const { error } = await supabase.from("reservations").insert({
    restaurant_id,
    nom_client,
    telephone,
    date_resa,
    heure_resa,
    nb_personnes,
    message,
  });

  if (error) {
    console.error("Erreur réservation:", error);
    return { succes: false, message: "Une erreur est survenue. Réessayez ou appelez-nous." };
  }

  return {
    succes: true,
    message: "Demande envoyée ! Le restaurant vous confirmera par téléphone ou WhatsApp.",
  };
}
