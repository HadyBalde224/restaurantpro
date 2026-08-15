import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TableauDeBordAdmin() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profil } = await supabase
    .from("profils_admin")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profil) redirect("/admin/login");

  const [
    { count: reservationsEnAttente, error: erreurReservations },
    { count: avisAModerer, error: erreurAvis },
    { count: nbPlats, error: erreurPlats },
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
  ]);

  if (erreurReservations) console.error("Erreur comptage réservations :", erreurReservations);
  if (erreurAvis) console.error("Erreur comptage avis :", erreurAvis);
  if (erreurPlats) console.error("Erreur comptage plats :", erreurPlats);

  const cartes = [
    {
      libelle: "Réservations en attente",
      valeur: reservationsEnAttente ?? 0,
      couleur: "text-amber-600",
      fond: "bg-amber-50",
    },
    {
      libelle: "Avis à modérer",
      valeur: avisAModerer ?? 0,
      couleur: "text-orange-600",
      fond: "bg-orange-50",
    },
    {
      libelle: "Plats au menu",
      valeur: nbPlats ?? 0,
      couleur: "text-blue-600",
      fond: "bg-blue-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <p className="mt-1 text-gray-500">Vue d&apos;ensemble de votre restaurant.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {cartes.map((carte) => (
          <div
            key={carte.libelle}
            className={`rounded-2xl border border-black/5 p-6 ${carte.fond}`}
          >
            <p className={`text-4xl font-bold ${carte.couleur}`}>{carte.valeur}</p>
            <p className="mt-2 text-sm font-medium text-gray-600">{carte.libelle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
