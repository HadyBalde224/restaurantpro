import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";

export default function Localisation({
  latitude,
  longitude,
  adresse,
  ville,
}: {
  latitude: number | null;
  longitude: number | null;
  adresse: string;
  ville: string;
}) {
  if (latitude === null || longitude === null) return null;

  const src = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <section
      id="localisation"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 md:py-32"
    >
      <Apparition>
        <TitreSection>Nous trouver</TitreSection>
        <p className="mt-4 text-center text-gray-500">
          {adresse}, {ville}
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-black/5 shadow-sm">
          <iframe
            src={src}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Localisation ${adresse}`}
          />
        </div>
      </Apparition>
    </section>
  );
}
