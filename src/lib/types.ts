export interface Restaurant {
  id: string;
  slug: string;
  nom: string;
  description: string;
  logo_url: string | null;
  photo_hero_url: string | null;
  couleur_primaire: string;
  couleur_accent: string;
  telephone: string;
  whatsapp: string;
  email: string;
  adresse: string;
  ville: string;
  latitude: number | null;
  longitude: number | null;
  horaires: Record<string, string>; // {"lundi": "11h30 – 23h00", ...}
  instagram: string;
  facebook: string;
  actif: boolean;
  devise: string;
}

export interface Plat {
  id: string;
  nom: string;
  description: string;
  prix: number;
  photo_url: string | null;
  disponible: boolean;
  ordre: number;
}

export interface CategorieMenu {
  id: string;
  nom: string;
  ordre: number;
  plats: Plat[]; // rempli par la requête imbriquée (tu vas voir)
}

export interface Avis {
  id: string;
  nom_client: string;
  note: number;
  commentaire: string;
  approuve: boolean;
  cree_le: string;
}
