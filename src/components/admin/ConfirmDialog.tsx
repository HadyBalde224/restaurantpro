"use client";

export default function ConfirmDialog({
  titre,
  description,
  enCours,
  onAnnuler,
  onConfirmer,
}: {
  titre: string;
  description: string;
  enCours: boolean;
  onAnnuler: () => void;
  onConfirmer: () => void;
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
            className="min-h-11 flex-1 rounded-xl bg-red-600 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {enCours ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
