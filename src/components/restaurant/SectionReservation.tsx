import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";
import FormulaireReservation from "@/components/restaurant/FormulaireReservation";

export default function SectionReservation({ restaurantId }: { restaurantId: string }) {
  return (
    <section
      id="reserver"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 md:py-32"
    >
      <Apparition>
        <TitreSection>Réserver une table</TitreSection>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <FormulaireReservation restaurantId={restaurantId} />
        </div>
      </Apparition>
    </section>
  );
}
