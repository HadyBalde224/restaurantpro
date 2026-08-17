import type { ComponentType } from "react";

export default function EnteteCarte({
  icone: Icone,
  couleur,
  fond,
  titre,
}: {
  icone: ComponentType<{ size?: number; className?: string }>;
  couleur: string;
  fond: string;
  titre: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${fond} ${couleur}`}>
        <Icone size={18} />
      </span>
      <h2 className="text-lg font-bold text-gray-900">{titre}</h2>
    </div>
  );
}
