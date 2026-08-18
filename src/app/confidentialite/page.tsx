import type { Metadata } from "next";
import LayoutLegal from "@/components/marketing/LayoutLegal";

export const metadata: Metadata = {
  title: "Politique de confidentialité — NEHMA",
  description: "Comment NEHMA collecte, utilise et protège vos données personnelles.",
};

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-white">{titre}</h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PageConfidentialite() {
  return (
    <LayoutLegal titre="Politique de confidentialité" misAJour="18 août 2026">
      <Section titre="Responsable du traitement">
        <p>
          Pour chaque site créé sur NEHMA, deux responsables du traitement coexistent : le
          restaurant client (pour les données de ses réservations et avis) et NEHMA elle-même
          (pour les comptes d&apos;administration et le fonctionnement technique de la plateforme).
          Cette politique décrit la manière dont NEHMA, en tant qu&apos;éditeur, traite les données
          circulant sur la plateforme, conformément à la loi marocaine n° 09-08 relative à la
          protection des personnes physiques à l&apos;égard du traitement des données à caractère
          personnel.
        </p>
      </Section>

      <Section titre="Données collectées">
        <p>NEHMA traite deux catégories de données :</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-white">Comptes administrateurs</span> : email et
            nom du restaurateur ou de son équipe, utilisés pour accéder à l&apos;espace de gestion
            du restaurant.
          </li>
          <li>
            <span className="font-semibold text-white">Visiteurs du site public</span> : nom,
            numéro de téléphone et message éventuel, saisis volontairement lors d&apos;une
            réservation ou du dépôt d&apos;un avis. Aucune donnée n&apos;est collectée sans action
            explicite du visiteur — il n&apos;y a pas de suivi silencieux de navigation.
          </li>
        </ul>
      </Section>

      <Section titre="Finalités">
        <p>
          Ces données servent exclusivement à faire fonctionner le service demandé : traiter une
          réservation, afficher un avis après modération par le restaurant, et permettre au
          restaurateur de gérer son établissement. Elles ne sont jamais utilisées à des fins
          publicitaires et ne sont jamais revendues à un tiers.
        </p>
      </Section>

      <Section titre="Conservation">
        <p>
          Les données de réservation et d&apos;avis sont conservées tant que le restaurant reste
          actif sur la plateforme. Un restaurant peut à tout moment demander la suppression de
          données précises via son espace de gestion, ou la suppression complète de son compte en
          contactant NEHMA.
        </p>
      </Section>

      <Section titre="Sécurité">
        <p>
          L&apos;accès aux données est cloisonné par restaurant : la base de données applique des
          règles de sécurité (Row Level Security) garantissant qu&apos;un restaurant ne peut jamais
          accéder aux données d&apos;un autre restaurant. Les échanges entre votre navigateur et nos
          serveurs sont chiffrés (HTTPS).
        </p>
      </Section>

      <Section titre="Cookies">
        <p>
          Le site public d&apos;un restaurant ne dépose aucun cookie de suivi ou publicitaire tiers.
          Seul l&apos;espace d&apos;administration utilise un cookie technique strictement
          nécessaire pour maintenir la session de connexion du restaurateur.
        </p>
      </Section>

      <Section titre="Vos droits">
        <p>
          Conformément à la loi 09-08 et aux textes équivalents applicables en Guinée, toute
          personne dispose d&apos;un droit d&apos;accès, de rectification et de suppression des
          données la concernant. Pour exercer ce droit, contactez :
        </p>
        <p>
          <a href="mailto:mamadouhady35@gmail.com" className="text-(--or) underline underline-offset-2">
            mamadouhady35@gmail.com
          </a>
        </p>
      </Section>
    </LayoutLegal>
  );
}
