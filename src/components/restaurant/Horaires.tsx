import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";

// Date.getDay() renvoie 0 pour dimanche, 1 pour lundi, etc.
const JOURS_PAR_INDEX = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

const JOURS_ORDONNES = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

export default function Horaires({ horaires }: { horaires: Record<string, string> }) {
  const jourActuel = JOURS_PAR_INDEX[new Date().getDay()];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
      <Apparition>
        <TitreSection>Horaires</TitreSection>

        <ul className="mx-auto mt-14 max-w-md divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
          {JOURS_ORDONNES.map((jour) => {
            const estAujourdhui = jour === jourActuel;
            return (
              <li
                key={jour}
                className={`flex items-center justify-between px-5 py-3 capitalize transition-colors duration-300 ${
                  estAujourdhui ? "font-semibold" : ""
                }`}
                style={
                  estAujourdhui
                    ? { background: "color-mix(in srgb, var(--accent) 12%, white)" }
                    : undefined
                }
              >
                <span>
                  {jour}
                  {estAujourdhui && " · aujourd'hui"}
                </span>
                <span>{horaires[jour] ?? "Fermé"}</span>
              </li>
            );
          })}
        </ul>
      </Apparition>
    </section>
  );
}
