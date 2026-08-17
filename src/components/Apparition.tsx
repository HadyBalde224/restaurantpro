"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Apparition({
  children,
  delai = 0,
  className = "",
  echelle = false,
}: {
  children: ReactNode;
  delai?: number;
  className?: string;
  echelle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Le contenu est visible par défaut (avant même l'hydratation) : le rendu
  // serveur et le tout premier rendu client sont identiques, donc pas de
  // mismatch d'hydratation. On ne masque un élément (pour l'effet d'apparition
  // au scroll) qu'une fois monté ET seulement s'il est hors écran — jamais
  // l'inverse. Ainsi, si le JS met du temps à s'exécuter (connexion lente,
  // bundle de dev volumineux sur mobile...), le contenu reste visible au lieu
  // de rester bloqué en opacity-0 indéfiniment.
  const [masque, setMasque] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const hauteurViewport = window.innerHeight || document.documentElement.clientHeight;
    const dejaVisible = rect.top < hauteurViewport && rect.bottom > 0;
    if (dejaVisible) return;

    setMasque(true);

    // threshold: 0 plutôt qu'un pourcentage — une section plus haute que le
    // viewport (fréquent sur mobile) peut ne jamais atteindre un seuil comme
    // 0.15 : elle resterait alors masquée même en plein milieu de l'écran.
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setMasque(false);
          observateur.disconnect();
        }
      },
      { threshold: 0 }
    );

    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        masque
          ? `opacity-0 translate-y-6 ${echelle ? "scale-95" : ""}`
          : "opacity-100 translate-y-0 scale-100"
      } ${className}`}
      style={{ transitionDelay: `${delai}ms` }}
    >
      {children}
    </div>
  );
}
