import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Avis, Reservation } from "@/lib/types";
import { IconeCalendrier, IconeEtoile, IconeMenu } from "@/components/admin/Icones";
import BadgeStatut from "@/components/admin/BadgeStatut";
import { statutAbonnement } from "@/lib/abonnement";

function formaterDateHeureResa(dateResa: string, heureResa: string) {
  const date = new Date(dateResa).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${date} à ${heureResa.slice(0, 5)}`;
}

function etoilesTexte(note: number) {
  return "★".repeat(note) + "☆".repeat(5 - note);
}

export default async function TableauDeBordAdmin() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("restaurant_id, role")
    .eq("id", user.id)
    .single();

  if (!profil) redirect("/admin/login");

  // Un super-admin n'a pas de restaurant_id : sans cette redirection, il
  // atterrissait après connexion sur ce tableau de bord restaurateur, qui se
  // rendait "vide" (toutes les requêtes filtrées sur restaurant_id=null ne
  // renvoient jamais rien) au lieu du vrai tableau de bord plateforme.
  if (profil.role === "super_admin") redirect("/admin/plateforme");

  const aujourdhui = new Date();
  const dansSeptJours = new Date();
  dansSeptJours.setDate(aujourdhui.getDate() + 7);
  const dateAujourdhuiIso = aujourdhui.toISOString().slice(0, 10);
  const dateDansSeptJoursIso = dansSeptJours.toISOString().slice(0, 10);

  const [
    { count: reservationsEnAttente, error: erreurReservations },
    { count: avisAModerer, error: erreurAvis },
    { count: nbPlats, error: erreurPlats },
    { count: reservationsSemaine, error: erreurReservationsSemaine },
    { data: dernieresReservations, error: erreurDernieresReservations },
    { data: derniersAvis, error: erreurDerniersAvis },
    { data: restaurant, error: erreurRestaurant },
  ] = await Promise.all([
    supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", profil.restaurant_id)
      .eq("statut", "en_attente"),
    supabase
      .from("avis")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", profil.restaurant_id)
      .eq("approuve", false),
    supabase
      .from("plats")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", profil.restaurant_id),
    supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", profil.restaurant_id)
      .eq("statut", "confirmee")
      .gte("date_resa", dateAujourdhuiIso)
      .lte("date_resa", dateDansSeptJoursIso),
    supabase
      .from("reservations")
      .select("*")
      .eq("restaurant_id", profil.restaurant_id)
      .order("cree_le", { ascending: false })
      .limit(5)
      .returns<Reservation[]>(),
    supabase
      .from("avis")
      .select("*")
      .eq("restaurant_id", profil.restaurant_id)
      .order("cree_le", { ascending: false })
      .limit(3)
      .returns<Avis[]>(),
    supabase.from("restaurants").select("nom").eq("id", profil.restaurant_id).single(),
  ]);

  // Lecture de son propre abonnement pour la bannière de retard de paiement.
  // Nécessite une policy RLS autorisant un admin à lire SA ligne abonnements
  // (absente par défaut) — sans elle, la requête renvoie juste aucune ligne
  // et la bannière ne s'affiche jamais (dégradation silencieuse, pas de crash).
  const { data: abonnement } = await supabase
    .from("abonnements")
    .select("paye_jusqu_au")
    .eq("restaurant_id", profil.restaurant_id)
    .maybeSingle();
  const statutPaiement = statutAbonnement(abonnement?.paye_jusqu_au ?? null);

  if (erreurReservations) console.error("Erreur comptage réservations :", erreurReservations);
  if (erreurAvis) console.error("Erreur comptage avis :", erreurAvis);
  if (erreurPlats) console.error("Erreur comptage plats :", erreurPlats);
  if (erreurReservationsSemaine) console.error("Erreur comptage réservations semaine :", erreurReservationsSemaine);
  if (erreurDernieresReservations) console.error("Erreur dernières réservations :", erreurDernieresReservations);
  if (erreurDerniersAvis) console.error("Erreur derniers avis :", erreurDerniersAvis);
  if (erreurRestaurant) console.error("Erreur chargement restaurant :", erreurRestaurant);

  const dateFormatee = aujourdhui.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cartes = [
    {
      libelle: "Réservations en attente",
      valeur: reservationsEnAttente ?? 0,
      couleur: "text-orange-600",
      fond: "bg-orange-50",
      lien: "/admin/reservations",
      Icone: IconeCalendrier,
    },
    {
      libelle: "Avis à modérer",
      valeur: avisAModerer ?? 0,
      couleur: "text-purple-600",
      fond: "bg-purple-50",
      lien: "/admin/avis",
      Icone: IconeEtoile,
    },
    {
      libelle: "Plats au menu",
      valeur: nbPlats ?? 0,
      couleur: "text-blue-600",
      fond: "bg-blue-50",
      lien: "/admin/menu",
      Icone: IconeMenu,
    },
    {
      libelle: "Réservations (7 prochains jours)",
      valeur: reservationsSemaine ?? 0,
      couleur: "text-green-600",
      fond: "bg-green-50",
      lien: "/admin/reservations",
      Icone: IconeCalendrier,
    },
  ];

  const prenomRestaurant = restaurant?.nom ?? "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Bienvenue{prenomRestaurant ? `, ${prenomRestaurant}` : ""} ! 👋
      </h1>
      <p className="mt-1 text-gray-500">Voici un aperçu de l&apos;activité de votre restaurant aujourd&apos;hui.</p>
      <p className="mt-0.5 text-sm capitalize text-gray-400">{dateFormatee}</p>

      {(statutPaiement.etat === "en_grace" || statutPaiement.etat === "expire") && (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-medium ${
            statutPaiement.etat === "en_grace"
              ? "border-orange-200 bg-orange-50 text-orange-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statutPaiement.etat === "en_grace"
            ? `Votre abonnement est en retard de paiement depuis ${statutPaiement.joursDepuisExpiration} jour(s). Régularisez sous ${statutPaiement.joursAvantCoupure} jour(s) pour éviter une suspension de votre site.`
            : "Votre abonnement est en retard de paiement au-delà du délai de grâce. Contactez-nous rapidement pour éviter la suspension de votre site."}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cartes.map((carte) => (
          <Link
            key={carte.libelle}
            href={carte.lien}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${carte.fond}`}>
              <carte.Icone size={22} className={carte.couleur} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{carte.valeur}</p>
              <p className="text-sm text-gray-500">{carte.libelle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Réservations récentes</h2>
            <Link href="/admin/reservations" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Voir tout →
            </Link>
          </div>
          {!dernieresReservations || dernieresReservations.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">Aucune réservation pour l&apos;instant.</p>
          ) : (
            <ul className="mt-2 divide-y divide-black/5">
              {dernieresReservations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{r.nom_client}</p>
                    <p className="text-xs text-gray-500">{formaterDateHeureResa(r.date_resa, r.heure_resa)}</p>
                  </div>
                  <BadgeStatut statut={r.statut} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Derniers avis</h2>
            <Link href="/admin/avis" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Voir tout →
            </Link>
          </div>
          {!derniersAvis || derniersAvis.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">Aucun avis pour l&apos;instant.</p>
          ) : (
            <ul className="mt-2 divide-y divide-black/5">
              {derniersAvis.map((a) => (
                <li key={a.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-gray-900">{a.nom_client}</p>
                    <BadgeStatut statut={a.approuve ? "publie" : "a_moderer"} />
                  </div>
                  <p className="mt-0.5 text-sm text-amber-500">{etoilesTexte(a.note)}</p>
                  {a.commentaire && (
                    <p className="mt-1 truncate text-sm text-gray-500">« {a.commentaire} »</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
