export type StatutBadge = "en_attente" | "confirmee" | "refusee" | "annulee" | "a_moderer" | "publie";

const STYLES: Record<StatutBadge, { texte: string; classe: string }> = {
  en_attente: { texte: "En attente", classe: "bg-orange-50 text-orange-700" },
  confirmee: { texte: "Confirmée", classe: "bg-green-50 text-green-700" },
  refusee: { texte: "Refusée", classe: "bg-red-50 text-red-700" },
  annulee: { texte: "Annulée", classe: "bg-gray-100 text-gray-500" },
  a_moderer: { texte: "À modérer", classe: "bg-orange-50 text-orange-700" },
  publie: { texte: "Publié", classe: "bg-green-50 text-green-700" },
};

export default function BadgeStatut({ statut }: { statut: StatutBadge }) {
  const style = STYLES[statut];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.classe}`}>
      {style.texte}
    </span>
  );
}
