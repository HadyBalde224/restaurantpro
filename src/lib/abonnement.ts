// Période de grâce avant coupure : un abonnement en retard ne coupe pas le
// site immédiatement — le restaurateur (et la plateforme) sont prévenus
// pendant JOURS_GRACE jours avant qu'une suspension manuelle ne soit décidée.
// Le site public n'est jamais coupé automatiquement par ce calcul : seul le
// champ restaurants.actif (basculé à la main par un super-admin) le fait.
export const JOURS_GRACE = 7;

export type EtatAbonnement = "sans_information" | "paye" | "en_grace" | "expire";

export type StatutAbonnement = {
  etat: EtatAbonnement;
  joursDepuisExpiration: number | null;
  joursAvantCoupure: number | null;
};

export function statutAbonnement(payeJusquAu: string | null, aujourdHui: Date = new Date()): StatutAbonnement {
  if (!payeJusquAu) {
    return { etat: "sans_information", joursDepuisExpiration: null, joursAvantCoupure: null };
  }

  const expiration = new Date(`${payeJusquAu}T00:00:00`);
  const UN_JOUR_MS = 24 * 60 * 60 * 1000;
  const joursDepuisExpiration = Math.floor((aujourdHui.getTime() - expiration.getTime()) / UN_JOUR_MS);

  if (joursDepuisExpiration <= 0) {
    return { etat: "paye", joursDepuisExpiration: null, joursAvantCoupure: null };
  }
  if (joursDepuisExpiration <= JOURS_GRACE) {
    return {
      etat: "en_grace",
      joursDepuisExpiration,
      joursAvantCoupure: JOURS_GRACE - joursDepuisExpiration,
    };
  }
  return { etat: "expire", joursDepuisExpiration, joursAvantCoupure: 0 };
}
