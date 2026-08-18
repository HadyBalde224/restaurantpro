import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { createClient } from "@/lib/supabase/server";
import type { CategorieMenu, Avis, PhotoGalerie } from "@/lib/types";
import Navbar from "@/components/restaurant/Navbar";
import Hero from "@/components/restaurant/Hero";
import SectionMenu from "@/components/restaurant/SectionMenu";
import Galerie from "@/components/restaurant/Galerie";
import SectionReservation from "@/components/restaurant/SectionReservation";
import SectionAvis from "@/components/restaurant/SectionAvis";
import Horaires from "@/components/restaurant/Horaires";
import Localisation from "@/components/restaurant/Localisation";
import Footer from "@/components/restaurant/Footer";
import BoutonWhatsApp from "@/components/restaurant/BoutonWhatsApp";
import PanierFlottant from "@/components/restaurant/PanierFlottant";

// L'image (og:image) est gérée séparément par le fichier opengraph-image.tsx
// du même dossier — priorité automatique de Next.js sur toute image définie
// ici, donc pas la peine de la dupliquer.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Même fonction cache() que la page : aucune requête Supabase supplémentaire.
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    return { title: "Restaurant introuvable — NEHMA" };
  }

  const description =
    restaurant.description?.trim() ||
    `Découvrez ${restaurant.nom}, propulsé par NEHMA : menu, réservations et commandes en ligne.`;

  return {
    title: `${restaurant.nom} — Menu, réservations et avis`,
    description,
    openGraph: {
      title: restaurant.nom,
      description,
      siteName: "NEHMA",
      type: "website",
    },
  };
}

export default async function PageRestaurant({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Même fonction cache() que le layout : aucune requête Supabase supplémentaire ici.
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const supabase = await createClient();

  const [
    { data: categories, error: erreurCategories },
    { data: avis, error: erreurAvis },
    { data: photosGalerie, error: erreurGalerie },
  ] = await Promise.all([
    supabase
      .from("categories_menu")
      .select("*, plats(*)")
      .eq("restaurant_id", restaurant.id)
      .order("ordre")
      .returns<CategorieMenu[]>(),
    supabase
      .from("avis")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("approuve", true)
      .returns<Avis[]>(),
    supabase
      .from("photos_galerie")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("ordre")
      .returns<PhotoGalerie[]>(),
  ]);

  if (erreurCategories) console.error("Erreur chargement menu :", erreurCategories);
  if (erreurAvis) console.error("Erreur chargement avis :", erreurAvis);
  if (erreurGalerie) console.error("Erreur chargement galerie :", erreurGalerie);

  const noteMoyenne =
    avis && avis.length > 0 ? avis.reduce((somme, a) => somme + a.note, 0) / avis.length : null;

  // Date.getDay() renvoie 0 pour dimanche, 1 pour lundi, etc.
  const JOURS_PAR_INDEX = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const jourActuel = JOURS_PAR_INDEX[new Date().getDay()];
  const horaireAujourdhui = restaurant.horaires?.[jourActuel] ?? "Fermé";

  return (
    <>
      <Navbar
        nom={restaurant.nom}
        whatsapp={restaurant.whatsapp}
        horaireAujourdhui={horaireAujourdhui}
        aGalerie={(photosGalerie ?? []).length > 0}
        logoUrl={restaurant.logo_url}
      />
      <Hero restaurant={restaurant} noteMoyenne={noteMoyenne} />
      <SectionMenu categories={categories ?? []} devise={restaurant.devise} />
      <Galerie photos={photosGalerie ?? []} nom={restaurant.nom} />
      <SectionReservation restaurantId={restaurant.id} devise={restaurant.devise} />
      <SectionAvis avis={avis ?? []} restaurantId={restaurant.id} slug={restaurant.slug} />
      <Horaires horaires={restaurant.horaires} />
      <Localisation
        latitude={restaurant.latitude}
        longitude={restaurant.longitude}
        adresse={restaurant.adresse}
        ville={restaurant.ville}
      />
      <Footer restaurant={restaurant} />
      <BoutonWhatsApp whatsapp={restaurant.whatsapp} nom={restaurant.nom} />
      <PanierFlottant restaurant={restaurant} />
    </>
  );
}
