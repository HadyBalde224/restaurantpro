import FormulaireNouveauRestaurant from "@/components/admin/plateforme/FormulaireNouveauRestaurant";

export default function PageNouveauRestaurant() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Nouveau restaurant</h1>
      <p className="mt-1 text-gray-500">Crée le site et le compte d&apos;accès de ton nouveau client.</p>

      <div className="mt-8 max-w-2xl">
        <FormulaireNouveauRestaurant />
      </div>
    </div>
  );
}
