import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/types";

// cache() dédoublonne l'appel Supabase entre le layout et la page :
// les deux appellent getRestaurant(slug) pour le même rendu, une seule requête part réellement.
export const getRestaurant = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single<Restaurant>();

  if (error) {
    console.error("Erreur chargement restaurant :", error);
  }

  return restaurant;
});
