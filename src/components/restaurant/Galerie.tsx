import Image from "next/image";
import type { PhotoGalerie } from "@/lib/types";
import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";

export default function Galerie({ photos, nom }: { photos: PhotoGalerie[]; nom: string }) {
  if (photos.length === 0) return null;

  return (
    <section id="galerie" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 md:py-32">
      <Apparition>
        <TitreSection>Galerie</TitreSection>
      </Apparition>

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <Apparition key={photo.id} delai={index * 60} echelle>
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={photo.url}
                alt={photo.legende || nom}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {photo.legende && (
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 py-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">{photo.legende}</p>
                </div>
              )}
            </div>
          </Apparition>
        ))}
      </div>
    </section>
  );
}
