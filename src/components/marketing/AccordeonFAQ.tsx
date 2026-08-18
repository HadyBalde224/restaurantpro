"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    question: "Dois-je savoir coder ?",
    reponse: "Non, tout se gère depuis votre téléphone : menu, photos, horaires, réservations. Aucune compétence technique n'est nécessaire.",
  },
  {
    question: "Combien de temps pour être en ligne ?",
    reponse: "Quelques jours seulement. On s'occupe de la mise en ligne : vous n'avez qu'à nous envoyer votre menu et vos photos par WhatsApp.",
  },
  {
    question: "Puis-je changer mon menu moi-même ?",
    reponse: "Oui, à tout moment, depuis votre espace de gestion : ajout de plats, prix, photos, disponibilité — sans nous contacter.",
  },
  {
    question: "Que se passe-t-il si je ne renouvelle pas ?",
    reponse: "Votre site est mis en pause et devient invisible pour vos clients, mais rien n'est supprimé : menu, avis et réservations sont conservés et réapparaissent dès le renouvellement.",
  },
  {
    question: "Et si je ne sais pas utiliser un ordinateur ?",
    reponse: "Aucun souci. Tout se gère depuis votre téléphone, aussi simplement qu'un statut WhatsApp.",
  },
];

function IconeChevron({ ouvert }: { ouvert: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-300 ${ouvert ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function AccordeonFAQ() {
  const [ouvert, setOuvert] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-(--surface)">
      {QUESTIONS.map((item, index) => {
        const estOuvert = ouvert === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOuvert(estOuvert ? null : index)}
              aria-expanded={estOuvert}
              className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-white/90 transition-colors duration-200 hover:text-white sm:px-6"
            >
              {item.question}
              <IconeChevron ouvert={estOuvert} />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                estOuvert ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-white/60 sm:px-6">{item.reponse}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
