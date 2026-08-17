import type { Avis } from "@/lib/types";
import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";
import FormulaireAvis from "@/components/restaurant/FormulaireAvis";
import CarrouselAvis from "@/components/restaurant/CarrouselAvis";

function Etoiles({ note }: { note: number }) {
  return (
    <div aria-label={`${note} sur 5`} className="flex gap-0.5" style={{ color: "var(--accent)" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(note) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function SectionAvis({
  avis,
  restaurantId,
  slug,
}: {
  avis: Avis[];
  restaurantId: string;
  slug: string;
}) {
  const approuves = avis.filter((a) => a.approuve);

  return (
    <section
      id="avis"
      className="scroll-mt-24 px-6 py-24 text-white sm:px-8 md:py-32"
      style={{ background: "color-mix(in srgb, var(--primaire) 85%, black)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {approuves.length === 0 ? (
          <Apparition>
            <TitreSection>Avis de nos clients</TitreSection>
            <p className="mx-auto mt-5 max-w-md text-center text-white/80">
              Soyez le premier à partager votre expérience ✨
            </p>

            <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-6 text-gray-900 shadow-sm sm:p-8">
              <FormulaireAvis restaurantId={restaurantId} slug={slug} />
            </div>
          </Apparition>
        ) : (
          <>
            <Apparition>
              <TitreSection>Avis de nos clients</TitreSection>
              <div className="mt-5 flex items-center justify-center gap-2">
                <Etoiles note={approuves.reduce((somme, a) => somme + a.note, 0) / approuves.length} />
                <span className="text-sm text-white/70">
                  {(approuves.reduce((somme, a) => somme + a.note, 0) / approuves.length).toFixed(1)} / 5 ·{" "}
                  {approuves.length} avis
                </span>
              </div>
            </Apparition>

            <CarrouselAvis avis={approuves} />
          </>
        )}
      </div>
    </section>
  );
}
