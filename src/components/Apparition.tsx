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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true);
          observateur.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : `opacity-0 translate-y-6 ${echelle ? "scale-95" : ""}`
      } ${className}`}
      style={{ transitionDelay: `${delai}ms` }}
    >
      {children}
    </div>
  );
}
