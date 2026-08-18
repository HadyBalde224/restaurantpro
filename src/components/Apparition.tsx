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

    const estDansViewport = () => {
      const rect = element.getBoundingClientRect();
      const hauteurViewport = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < hauteurViewport && rect.bottom > 0;
    };

    if (estDansViewport()) return;

    setMasque(true);

    // Vérification directe au scroll/resize (getBoundingClientRect) plutôt
    // qu'IntersectionObserver : ce dernier s'est montré peu fiable sur
    // Safari/iOS réel (callback qui ne se déclenche pas de façon cohérente
    // pour certains éléments), là où getBoundingClientRect a été vérifié
    // fiable dans toutes les conditions testées.
    let actif = true;
    let enAttente = false;

    const verifier = () => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        if (!actif) return;
        if (estDansViewport()) {
          setMasque(false);
          actif = false;
          window.removeEventListener("scroll", verifier);
          window.removeEventListener("resize", verifier);
        }
      });
    };

    window.addEventListener("scroll", verifier, { passive: true });
    window.addEventListener("resize", verifier);

    return () => {
      actif = false;
      window.removeEventListener("scroll", verifier);
      window.removeEventListener("resize", verifier);
    };
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
