import Image from "next/image";
import type { CategorieMenu, Plat } from "@/lib/types";
import Apparition from "@/components/Apparition";
import TitreSection from "@/components/restaurant/TitreSection";
import BoutonAjouterPanier from "@/components/restaurant/BoutonAjouterPanier";

function CartePlat({ plat, devise }: { plat: Plat; devise: string }) {
  if (plat.photo_url) {
    return (
      <article
        className={`group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          !plat.disponible ? "opacity-60" : ""
        }`}
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={plat.photo_url}
            alt={plat.nom}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-bold text-white shadow"
            style={{ background: "var(--accent)" }}
          >
            {plat.prix} {devise}
          </span>
          {!plat.disponible && (
            <span className="absolute top-3 left-3 rounded-full bg-red-600 px-3 py-0.5 text-xs font-medium text-white shadow">
              Épuisé
            </span>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-semibold">{plat.nom}</h4>
          {plat.description && (
            <p className="mt-1 text-sm text-gray-500">{plat.description}</p>
          )}
          {plat.disponible && <BoutonAjouterPanier plat={plat} />}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`flex h-full flex-col justify-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        !plat.disponible ? "opacity-60" : ""
      }`}
    >
      <h4 className="text-lg" style={{ fontFamily: "var(--font-titre)" }}>
        {plat.nom}
      </h4>
      <span
        className="mx-auto my-3 block h-px w-10"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
      {plat.description && (
        <p className="text-sm text-gray-500">{plat.description}</p>
      )}
      <span
        className="mx-auto mt-4 inline-block w-fit rounded-full px-3 py-1 text-sm font-bold text-white"
        style={{ background: "var(--accent)" }}
      >
        {plat.prix} {devise}
      </span>
      {!plat.disponible && (
        <span className="mx-auto mt-3 inline-block w-fit rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-600">
          Épuisé
        </span>
      )}
      {plat.disponible && <BoutonAjouterPanier plat={plat} />}
    </article>
  );
}

export default function SectionMenu({
  categories,
  devise,
}: {
  categories: CategorieMenu[];
  devise: string;
}) {
  if (categories.length === 0) return null;

  return (
    <section id="menu" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 md:py-32">
      <Apparition>
        <TitreSection>Notre menu</TitreSection>
      </Apparition>

      <div className="mt-16 space-y-16">
        {categories.map((categorie) => (
          <div key={categorie.id}>
            <Apparition>
              <h3
                className="border-b-2 pb-2 text-2xl font-semibold"
                style={{ borderColor: "var(--accent)" }}
              >
                {categorie.nom}
              </h3>
            </Apparition>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categorie.plats
                .slice()
                .sort((a, b) => a.ordre - b.ordre)
                .map((plat, index) => (
                  <Apparition key={plat.id} delai={index * 80}>
                    <CartePlat plat={plat} devise={devise} />
                  </Apparition>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
