import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { createClient } from "@/lib/supabase/server";
import type { CategorieMenu, Avis } from "@/lib/types";
import Navbar from "@/components/restaurant/Navbar";
import Hero from "@/components/restaurant/Hero";
import SectionMenu from "@/components/restaurant/SectionMenu";
import SectionReservation from "@/components/restaurant/SectionReservation";
import SectionAvis from "@/components/restaurant/SectionAvis";
import Horaires from "@/components/restaurant/Horaires";
import Localisation from "@/components/restaurant/Localisation";
import Footer from "@/components/restaurant/Footer";
import BoutonWhatsApp from "@/components/restaurant/BoutonWhatsApp";
import PanierFlottant from "@/components/restaurant/PanierFlottant";

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

  const [{ data: categories, error: erreurCategories }, { data: avis, error: erreurAvis }] =
    await Promise.all([
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
    ]);

  if (erreurCategories) console.error("Erreur chargement menu :", erreurCategories);
  if (erreurAvis) console.error("Erreur chargement avis :", erreurAvis);

  return (
    <>
      <Navbar nom={restaurant.nom} />
      <Hero restaurant={restaurant} />
      <SectionMenu categories={categories ?? []} devise={restaurant.devise} />
      <SectionReservation restaurantId={restaurant.id} />
      <SectionAvis avis={avis ?? []} />
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
