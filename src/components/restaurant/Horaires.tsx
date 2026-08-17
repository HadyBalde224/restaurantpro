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

function IconeCalendrier({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 9h18" />
    </svg>
  );
}

function IconeHorloge({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l2.5 2" />
    </svg>
  );
}

type Plage = { debut: number; fin: number };

// Comprend "11h30 – 23h00" (tiret cadratin ou tiret simple). Retourne null
// si le texte ne suit pas ce format (ex. "Fermé" ou une saisie libre).
function parserPlage(horaire: string | undefined): Plage | null {
  if (!horaire) return null;
  const m = horaire.match(/(\d{1,2})h(\d{2})\s*[–-]\s*(\d{1,2})h(\d{2})/);
  if (!m) return null;
  return {
    debut: Number(m[1]) * 60 + Number(m[2]),
    fin: Number(m[3]) * 60 + Number(m[4]),
  };
}

function estDansPlage(minuteActuelle: number, plage: Plage): boolean {
  if (plage.fin >= plage.debut) {
    return minuteActuelle >= plage.debut && minuteActuelle < plage.fin;
  }
  // Plage à cheval sur minuit (ex. 20h00 – 02h00)
  return minuteActuelle >= plage.debut || minuteActuelle < plage.fin;
}

function formaterDuree(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formaterHeure(minute: number): string {
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

export default function Horaires({ horaires }: { horaires: Record<string, string> }) {
  const maintenant = new Date();
  const indexJourActuel = maintenant.getDay();
  const jourActuel = JOURS_PAR_INDEX[indexJourActuel];
  const minuteActuelle = maintenant.getHours() * 60 + maintenant.getMinutes();

  const plageAujourdhui = parserPlage(horaires[jourActuel]);
  const ouvert = plageAujourdhui ? estDansPlage(minuteActuelle, plageAujourdhui) : false;

  let statutTitre: string;
  let statutSousTitre: string;
  let pastille: string | null = null;

  if (ouvert && plageAujourdhui) {
    statutTitre = "Ouvert maintenant";
    statutSousTitre = `Nous sommes ouverts jusqu'à ${formaterHeure(plageAujourdhui.fin)}`;
    const minutesRestantes =
      plageAujourdhui.fin >= plageAujourdhui.debut
        ? plageAujourdhui.fin - minuteActuelle
        : plageAujourdhui.fin + 24 * 60 - minuteActuelle;
    pastille = `Ferme dans ${formaterDuree(minutesRestantes)}`;
  } else {
    // Cherche la prochaine ouverture, jusqu'à 7 jours en avant (aujourd'hui inclus).
    let prochaine: { jour: string; estAujourdhui: boolean; plage: Plage } | null = null;
    for (let decalage = 0; decalage <= 7; decalage++) {
      const index = (indexJourActuel + decalage) % 7;
      const jour = JOURS_PAR_INDEX[index];
      const plage = parserPlage(horaires[jour]);
      if (!plage) continue;
      if (decalage === 0 && plage.debut <= minuteActuelle) continue; // déjà passé aujourd'hui
      prochaine = { jour, estAujourdhui: decalage === 0, plage };
      break;
    }
    statutTitre = "Fermé actuellement";
    statutSousTitre = prochaine
      ? `Nous ouvrons ${prochaine.estAujourdhui ? "aujourd'hui" : prochaine.jour} à ${formaterHeure(prochaine.plage.debut)}`
      : "Consultez nos horaires ci-dessous";
  }

  return (
    <section id="horaires" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 md:py-32">
      <Apparition>
        <TitreSection>Horaires</TitreSection>

        <div className="mx-auto mt-14 max-w-2xl">
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4 sm:px-6 ${
              ouvert ? "bg-green-50" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  ouvert ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                }`}
              >
                <IconeHorloge className="h-4 w-4" />
              </span>
              <div>
                <p className={`text-sm font-semibold ${ouvert ? "text-green-800" : "text-gray-700"}`}>
                  {statutTitre}
                </p>
                <p className={`text-xs ${ouvert ? "text-green-700/80" : "text-gray-500"}`}>
                  {statutSousTitre}
                </p>
              </div>
            </div>
            {pastille && (
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                {pastille}
              </span>
            )}
          </div>

          <ul className="mt-4 divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
            {JOURS_ORDONNES.map((jour) => {
              const estAujourdhui = jour === jourActuel;
              const plage = parserPlage(horaires[jour]);
              const jourOuvert = !!plage;

              return (
                <li
                  key={jour}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors duration-300"
                  style={
                    estAujourdhui
                      ? { background: "color-mix(in srgb, var(--accent) 10%, white)" }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: estAujourdhui ? "var(--accent)" : "#f3f4f6",
                        color: estAujourdhui ? "white" : "#9ca3af",
                      }}
                    >
                      <IconeCalendrier />
                    </span>
                    <span className={`capitalize ${estAujourdhui ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                      {jour}
                      {estAujourdhui && (
                        <span className="ml-1 font-normal text-gray-500">· Aujourd&apos;hui</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        jourOuvert ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${jourOuvert ? "bg-green-500" : "bg-gray-400"}`}
                        aria-hidden="true"
                      />
                      {jourOuvert ? "Ouvert" : "Fermé"}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-sm"
                      style={estAujourdhui ? { color: "var(--accent)", fontWeight: 600 } : { color: "#6b7280" }}
                    >
                      <IconeHorloge className="h-3.5 w-3.5" />
                      {horaires[jour] ?? "Fermé"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Apparition>
    </section>
  );
}
