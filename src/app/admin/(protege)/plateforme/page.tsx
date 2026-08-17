import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Abonnement } from "@/lib/types";
import { IconeBoutique, IconeCalendrier, IconeArgent, IconeAlerte, IconePlus, IconeFlecheDroite } from "@/components/admin/Icones";
import BadgeStatut from "@/components/admin/BadgeStatut";

type RestaurantListe = {
  id: string;
  nom: string;
  ville: string;
  slug: string;
  actif: boolean;
};

function formaterDate(dateIso: string | null): string {
  if (!dateIso) return "—";
  return new Date(dateIso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PageTableauDeBordPlateforme() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const ilYa30Jours = new Date();
  ilYa30Jours.setDate(ilYa30Jours.getDate() - 30);

  const [
    { data: restaurants, error: erreurRestaurants },
    { data: abonnements, error: erreurAbonnements },
    { count: reservations30Jours, error: erreurReservations },
  ] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, nom, ville, slug, actif")
      .order("nom")
      .returns<RestaurantListe[]>(),
    supabase.from("abonnements").select("*").returns<Abonnement[]>(),
    supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .gte("cree_le", ilYa30Jours.toISOString()),
  ]);

  if (erreurRestaurants) console.error("Erreur chargement restaurants :", erreurRestaurants);
  if (erreurAbonnements) console.error("Erreur chargement abonnements :", erreurAbonnements);
  if (erreurReservations) console.error("Erreur comptage réservations :", erreurReservations);

  const listeRestaurants = restaurants ?? [];
  const listeAbonnements = abonnements ?? [];
  const abonnementParRestaurant = new Map(listeAbonnements.map((a) => [a.restaurant_id, a]));

  const nbActifs = listeRestaurants.filter((r) => r.actif).length;
  const nbSuspendus = listeRestaurants.length - nbActifs;

  const aujourdhui = new Date();
  const estExpire = (abonnement: Abonnement | undefined) =>
    !abonnement?.paye_jusqu_au || new Date(abonnement.paye_jusqu_au) < aujourdhui;

  const revenuMensuel = listeRestaurants
    .filter((r) => r.actif)
    .reduce((somme, r) => somme + (abonnementParRestaurant.get(r.id)?.prix_mensuel ?? 0), 0);

  const nbExpires = listeRestaurants.filter((r) => estExpire(abonnementParRestaurant.get(r.id))).length;

  const cartes = [
    {
      libelle: "Restaurants",
      valeur: listeRestaurants.length,
      sousTexte: `${nbActifs} actifs · ${nbSuspendus} suspendus`,
      couleur: "text-purple-600",
      fond: "bg-purple-50",
      Icone: IconeBoutique,
    },
    {
      libelle: "Réservations (30 derniers jours)",
      valeur: reservations30Jours ?? 0,
      sousTexte: "Toutes plateformes confondues",
      couleur: "text-blue-600",
      fond: "bg-blue-50",
      Icone: IconeCalendrier,
    },
    {
      libelle: "Revenu mensuel théorique",
      valeur: `${revenuMensuel.toLocaleString("fr-FR")} MAD`,
      sousTexte: "Abonnements des restaurants actifs",
      couleur: "text-green-600",
      fond: "bg-green-50",
      Icone: IconeArgent,
    },
    {
      libelle: "Abonnements expirés",
      valeur: nbExpires,
      sousTexte: "Non payés ou échus",
      couleur: "text-orange-600",
      fond: "bg-orange-50",
      Icone: IconeAlerte,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plateforme</h1>
          <p className="mt-1 text-gray-500">Vue d&apos;ensemble de tous les restaurants clients.</p>
        </div>
        <Link
          href="/admin/plateforme/restaurants/nouveau"
          style={{ background: "var(--accent)", color: "var(--primaire)" }}
          className="flex min-h-11 items-center gap-2 rounded-xl px-5 font-semibold transition hover:opacity-90"
        >
          <IconePlus size={16} />
          Nouveau restaurant
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cartes.map((carte) => (
          <div key={carte.libelle} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${carte.fond}`}>
              <carte.Icone size={22} className={carte.couleur} />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{carte.valeur}</p>
            <p className="text-sm font-medium text-gray-600">{carte.libelle}</p>
            <p className="mt-0.5 text-xs text-gray-400">{carte.sousTexte}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white shadow-sm">
        <div className="border-b border-black/5 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Restaurants</h2>
        </div>

        {listeRestaurants.length === 0 ? (
          <p className="px-5 py-10 text-center text-gray-400">Aucun restaurant pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {listeRestaurants.map((restaurant) => {
              const abonnement = abonnementParRestaurant.get(restaurant.id);
              return (
                <li key={restaurant.id}>
                  <Link
                    href={`/admin/plateforme/restaurants/${restaurant.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors duration-150 hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{restaurant.nom}</p>
                      <p className="text-sm text-gray-500">{restaurant.ville}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <BadgeStatut statut={restaurant.actif ? "actif" : "suspendu"} />
                      <span className="text-sm text-gray-500">
                        Payé jusqu&apos;au {formaterDate(abonnement?.paye_jusqu_au ?? null)}
                      </span>
                      <IconeFlecheDroite size={16} className="text-gray-300" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
