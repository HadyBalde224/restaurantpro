import type { Avis } from "@/lib/types";
import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";

function Etoiles({ note }: { note: number }) {
  return (
    <div aria-label={`${note} sur 5`} className="flex gap-0.5" style={{ color: "var(--accent)" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(note) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function SectionAvis({ avis }: { avis: Avis[] }) {
  const approuves = avis.filter((a) => a.approuve);
  if (approuves.length === 0) return null;

  const moyenne =
    approuves.reduce((somme, a) => somme + a.note, 0) / approuves.length;

  return (
    <section
      id="avis"
      className="scroll-mt-24 px-6 py-24 text-white sm:px-8 md:py-32"
      style={{ background: "color-mix(in srgb, var(--primaire) 85%, black)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Apparition>
          <TitreSection>Avis de nos clients</TitreSection>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Etoiles note={moyenne} />
            <span className="text-sm text-white/70">
              {moyenne.toFixed(1)} / 5 · {approuves.length} avis
            </span>
          </div>
        </Apparition>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {approuves.map((a, index) => (
            <Apparition key={a.id} delai={index * 80}>
              <article className="relative h-full overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <span
                  className="pointer-events-none absolute -top-4 right-4 text-8xl leading-none text-white/10"
                  style={{ fontFamily: "var(--font-titre)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </span>
                <Etoiles note={a.note} />
                <p className="relative mt-3 text-white/85">« {a.commentaire} »</p>
                <p className="relative mt-4 text-sm font-semibold text-white">
                  {a.nom_client}
                </p>
              </article>
            </Apparition>
          ))}
        </div>
      </div>
    </section>
  );
}
