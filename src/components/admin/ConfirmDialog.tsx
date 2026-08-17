"use client";

export default function ConfirmDialog({
  titre,
  description,
  enCours,
  onAnnuler,
  onConfirmer,
  labelConfirmer = "Supprimer",
  labelEnCours = "Suppression...",
  variante = "danger",
}: {
  titre: string;
  description: string;
  enCours: boolean;
  onAnnuler: () => void;
  onConfirmer: () => void;
  labelConfirmer?: string;
  labelEnCours?: string;
  variante?: "danger" | "primaire";
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onAnnuler} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900">{titre}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onAnnuler}
            disabled={enCours}
            className="min-h-11 flex-1 rounded-xl border border-gray-300 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirmer}
            disabled={enCours}
            className={`min-h-11 flex-1 rounded-xl font-semibold transition disabled:opacity-60 ${
              variante === "danger" ? "bg-red-600 text-white hover:bg-red-700" : "hover:opacity-90"
            }`}
            style={variante === "primaire" ? { background: "var(--accent)", color: "var(--primaire)" } : undefined}
          >
            {enCours ? labelEnCours : labelConfirmer}
          </button>
        </div>
      </div>
    </div>
  );
}
