"use client";

export default function BarreActions({
  enCours,
  message,
}: {
  enCours: boolean;
  message: { texte: string; erreur: boolean } | null;
}) {
  return (
    <div className="flex items-center gap-4 pt-1">
      <button
        type="submit"
        disabled={enCours}
        style={{ background: "var(--accent)", color: "var(--primaire)" }}
        className="min-h-11 rounded-xl px-5 font-semibold transition hover:opacity-90 disabled:opacity-60"
      >
        {enCours ? "Enregistrement..." : "Enregistrer"}
      </button>
      {message && (
        <span className={`text-sm font-medium ${message.erreur ? "text-red-600" : "text-green-600"}`}>
          {message.texte}
        </span>
      )}
    </div>
  );
}
