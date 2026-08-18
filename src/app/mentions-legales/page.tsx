import type { Metadata } from "next";
import LayoutLegal from "@/components/marketing/LayoutLegal";

export const metadata: Metadata = {
  title: "Mentions légales — NEHMA",
  description: "Mentions légales de la plateforme NEHMA.",
};

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-white">{titre}</h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PageMentionsLegales() {
  return (
    <LayoutLegal titre="Mentions légales" misAJour="18 août 2026">
      <Section titre="Éditeur de la plateforme">
        <p>
          NEHMA est une plateforme éditée par{" "}
          <span className="text-white/40">[Nom légal de l&apos;éditeur à compléter]</span>,{" "}
          <span className="text-white/40">[statut juridique, ex. auto-entrepreneur / société]</span>,
          dont le siège est situé à <span className="text-white/40">[adresse à compléter]</span>.
        </p>
        <p>
          Numéro d&apos;identification :{" "}
          <span className="text-white/40">[ICE / registre du commerce à compléter]</span>.
        </p>
        <p>
          Contact :{" "}
          <a href="mailto:mamadouhady35@gmail.com" className="text-(--or) underline underline-offset-2">
            mamadouhady35@gmail.com
          </a>
        </p>
      </Section>

      <Section titre="Nature du service">
        <p>
          NEHMA fournit à des restaurants clients un site vitrine numérique (menu, réservations,
          avis, commande via WhatsApp) et un espace de gestion associé. Chaque restaurant utilisant
          NEHMA reste seul responsable du contenu qu&apos;il publie sur son site : nom, description,
          menu, prix, photos, horaires et coordonnées.
        </p>
      </Section>

      <Section titre="Hébergement">
        <p>
          Le site et les données associées sont hébergés sur l&apos;infrastructure Vercel (hébergement
          applicatif) et Supabase (base de données et stockage). Ces hébergeurs appliquent leurs
          propres standards de sécurité et de disponibilité.
        </p>
      </Section>

      <Section titre="Propriété intellectuelle">
        <p>
          La marque « NEHMA », l&apos;interface, le code et le design de la plateforme sont la
          propriété de son éditeur. Le contenu propre à chaque restaurant (nom, logo, photos, menu)
          reste la propriété exclusive du restaurant concerné.
        </p>
      </Section>

      <Section titre="Responsabilité">
        <p>
          NEHMA met à disposition l&apos;outil technique permettant à un restaurant de gérer et
          diffuser ses informations. NEHMA ne vérifie pas et ne garantit pas l&apos;exactitude des
          informations publiées par chaque restaurant (prix, disponibilité, horaires) : celles-ci
          relèvent de la seule responsabilité du restaurant qui les a saisies.
        </p>
      </Section>

      <Section titre="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit du pays d&apos;immatriculation du
          restaurant client (Maroc ou Guinée selon le cas). Tout litige relève des juridictions
          compétentes de ce pays.
        </p>
      </Section>
    </LayoutLegal>
  );
}
