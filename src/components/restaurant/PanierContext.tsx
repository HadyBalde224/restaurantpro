"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Plat } from "@/lib/types";

export type LignePanier = {
  plat: Plat;
  quantite: number;
};

type PanierContextValeur = {
  lignes: LignePanier[];
  ajouter: (plat: Plat) => void;
  retirer: (platId: string) => void;
  changerQuantite: (platId: string, quantite: number) => void;
  vider: () => void;
  total: number;
  nombreArticles: number;
};

const PanierContext = createContext<PanierContextValeur | null>(null);

export function PanierProvider({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<LignePanier[]>([]);

  const ajouter = (plat: Plat) => {
    setLignes((precedentes) => {
      const existante = precedentes.find((l) => l.plat.id === plat.id);
      if (existante) {
        return precedentes.map((l) =>
          l.plat.id === plat.id ? { ...l, quantite: l.quantite + 1 } : l
        );
      }
      return [...precedentes, { plat, quantite: 1 }];
    });
  };

  const retirer = (platId: string) => {
    setLignes((precedentes) => precedentes.filter((l) => l.plat.id !== platId));
  };

  const changerQuantite = (platId: string, quantite: number) => {
    if (quantite <= 0) {
      retirer(platId);
      return;
    }
    setLignes((precedentes) =>
      precedentes.map((l) => (l.plat.id === platId ? { ...l, quantite } : l))
    );
  };

  const vider = () => setLignes([]);

  const total = useMemo(
    () => lignes.reduce((somme, l) => somme + l.plat.prix * l.quantite, 0),
    [lignes]
  );

  const nombreArticles = useMemo(
    () => lignes.reduce((somme, l) => somme + l.quantite, 0),
    [lignes]
  );

  return (
    <PanierContext.Provider
      value={{ lignes, ajouter, retirer, changerQuantite, vider, total, nombreArticles }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const contexte = useContext(PanierContext);
  if (!contexte) {
    throw new Error("usePanier() doit être appelé à l'intérieur d'un <PanierProvider>.");
  }
  return contexte;
}
