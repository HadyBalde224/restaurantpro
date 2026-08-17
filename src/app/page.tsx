import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import Apparition from "@/components/Apparition";
import AccordeonFAQ from "@/components/marketing/AccordeonFAQ";
import SectionTarifs from "@/components/marketing/SectionTarifs";

export const metadata: Metadata = {
  title: "NEHMA — Créez le site de votre restaurant",
  description:
    "NEHMA crée des sites professionnels pour restaurants en Guinée et au Maroc : menu numérique, réservations, commandes WhatsApp, sans commission sur vos ventes.",
};

const WHATSAPP_GUINEE = "224622014608";
const WHATSAPP_MAROC = "212693269381";
const MESSAGE_CONTACT = encodeURIComponent(
  "Bonjour, je voudrais en savoir plus sur NEHMA pour mon restaurant."
);

function IconeWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.343.652 4.53 1.785 6.4L4 29l7.79-1.75A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16.001 3zm0 21.7c-1.96 0-3.79-.55-5.35-1.5l-.383-.23-4.62 1.04 1.02-4.5-.25-.39A9.68 9.68 0 0 1 6.3 15c0-5.35 4.35-9.7 9.7-9.7s9.7 4.35 9.7 9.7-4.349 9.7-9.699 9.7zm5.34-7.27c-.29-.145-1.72-.85-1.99-.945-.267-.098-.462-.145-.656.145-.194.29-.75.945-.92 1.14-.17.194-.34.218-.63.073-.29-.145-1.224-.451-2.332-1.437-.862-.768-1.444-1.717-1.613-2.007-.169-.29-.018-.446.127-.59.13-.13.29-.34.435-.51.145-.17.194-.29.29-.484.097-.194.048-.363-.024-.508-.073-.145-.656-1.58-.9-2.164-.237-.57-.478-.492-.656-.5l-.559-.01c-.194 0-.508.073-.774.363-.267.29-1.02.996-1.02 2.43s1.044 2.82 1.19 3.014c.145.194 2.055 3.14 4.98 4.404.696.3 1.238.48 1.66.615.697.222 1.332.19 1.833.115.559-.083 1.72-.703 1.962-1.382.243-.678.243-1.26.17-1.382-.073-.121-.267-.194-.556-.34z" />
    </svg>
  );
}

function IconePersonnalisation({ className }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.6-1.4-.4-.4-.6-.9-.6-1.4 0-1.1.9-2 2-2h1.6c1.9 0 3.6-1.7 3.6-3.6C20 6.7 16.4 3 12 3Z" />
      <circle cx="7.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconeZeroCommission({ className }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 8.5l7 7" />
      <circle cx="9" cy="9" r="0.5" fill="currentColor" />
      <circle cx="15" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
}

function IconePret({ className }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 9h18" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

const BENEFICES = [
  {
    Icone: IconePersonnalisation,
    titre: "Votre site, à votre image",
    texte: "Logo, couleurs et menu modifiables par vous-même, sans toucher au code.",
  },
  {
    Icone: IconeZeroCommission,
    titre: "Zéro commission",
    texte: "Contrairement à Glovo et consorts, vous gardez 100% de vos ventes.",
  },
  {
    Icone: IconeWhatsApp,
    titre: "Commandes et réservations sur WhatsApp",
    texte: "Vos clients commandent, vous recevez tout directement.",
  },
  {
    Icone: IconePret,
    titre: "Prêt en quelques jours",
    texte: "On s'occupe de tout : menu, photos, mise en ligne.",
  },
];

export default async function PageAccueil() {
  const weltare = await getRestaurant("weltare");
  const photoApercu = weltare?.photos_hero?.[0] ?? null;

  return (
    <div className="zone-marketing min-h-screen bg-(--fond)">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-20 pb-20 text-center sm:px-8 sm:pt-28 sm:pb-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
          style={{ background: "radial-gradient(ellipse at top, color-mix(in srgb, var(--or) 14%, transparent) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative">
          <Apparition>
            <p className="text-sm font-bold tracking-[0.3em] text-(--or) uppercase">NEHMA</p>
          </Apparition>

          <Apparition delai={100}>
            <h1
              className="mx-auto mt-6 max-w-3xl font-bold leading-[1.1] text-white"
              style={{ fontSize: "clamp(2.25rem, 6vw, 4rem)" }}
            >
              Votre restaurant mérite un vrai site web
            </h1>
          </Apparition>

          <Apparition delai={200}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
              NEHMA crée votre site professionnel : menu numérique, réservations et
              commandes WhatsApp, sans commission sur vos ventes.
            </p>
          </Apparition>

          <Apparition delai={300}>
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/weltare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center rounded-full px-7 py-3.5 font-semibold transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ background: "var(--or)", color: "var(--fond)" }}
                >
                  Voir une démo
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_GUINEE}?text=${MESSAGE_CONTACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  <IconeWhatsApp />
                  Nous contacter sur WhatsApp
                </a>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_MAROC}?text=${MESSAGE_CONTACT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center text-sm text-white/40 underline-offset-4 transition-colors duration-300 hover:text-white/70 hover:underline"
              >
                🇲🇦 Contact Maroc
              </a>
            </div>
          </Apparition>
        </div>
      </section>

      {/* BÉNÉFICES */}
      <section className="px-6 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFICES.map(({ Icone, titre, texte }, index) => (
            <Apparition key={titre} delai={index * 80} echelle>
              <div className="h-full rounded-2xl border border-white/10 bg-(--surface) p-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "color-mix(in srgb, var(--or) 18%, transparent)", color: "var(--or)" }}
                >
                  <Icone />
                </div>
                <h3 className="mt-4 font-bold text-white">{titre}</h3>
                <p className="mt-2 text-sm text-white/60">{texte}</p>
              </div>
            </Apparition>
          ))}
        </div>
      </section>

      {/* DÉMO */}
      <section className="px-6 py-20 sm:px-8">
        <Apparition>
          <h2
            className="mx-auto max-w-2xl text-center font-bold text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Voyez à quoi ressemble votre futur site
          </h2>
        </Apparition>

        <Apparition delai={150}>
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 bg-black/40 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="ml-3 truncate rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                  nehma.app/weltare
                </span>
              </div>
              <div className="relative aspect-16/10 bg-(--surface)">
                {photoApercu ? (
                  <Image
                    src={photoApercu}
                    alt={`Aperçu du site de ${weltare?.nom ?? "Weltare"}`}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">
                    Aperçu à venir
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/weltare"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-semibold text-(--or) transition-opacity duration-200 hover:opacity-80"
              >
                Explorer le site de démonstration →
              </a>
            </div>
          </div>
        </Apparition>
      </section>

      {/* TARIFS */}
      <section className="px-6 py-20 sm:px-8">
        <Apparition>
          <h2
            className="mx-auto max-w-2xl text-center font-bold text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Un tarif simple, sans surprise
          </h2>
        </Apparition>
        <Apparition delai={150}>
          <div className="mt-12">
            <SectionTarifs />
          </div>
        </Apparition>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 sm:px-8">
        <Apparition>
          <h2
            className="mx-auto max-w-2xl text-center font-bold text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Questions fréquentes
          </h2>
        </Apparition>
        <Apparition delai={150}>
          <div className="mt-12">
            <AccordeonFAQ />
          </div>
        </Apparition>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-12 text-center sm:px-8">
        <p className="text-lg font-bold text-white">NEHMA</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
          <a
            href={`https://wa.me/${WHATSAPP_GUINEE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center transition-colors duration-200 hover:text-white"
          >
            WhatsApp Guinée
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_MAROC}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center transition-colors duration-200 hover:text-white"
          >
            WhatsApp Maroc
          </a>
          <a
            href="mailto:mamadouhady35@gmail.com"
            className="flex min-h-11 items-center transition-colors duration-200 hover:text-white"
          >
            mamadouhady35@gmail.com
          </a>
        </div>

        <p className="mt-8 text-xs text-white/30">
          © {new Date().getFullYear()} NEHMA. Tous droits réservés.
        </p>
        <Link
          href="/admin/login"
          className="mt-3 inline-flex min-h-11 items-center text-xs text-white/25 transition-colors duration-200 hover:text-white/50"
        >
          Connexion
        </Link>
      </footer>
    </div>
  );
}
