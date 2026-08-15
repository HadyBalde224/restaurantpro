import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { getRestaurant } from "@/lib/restaurant";
import { PanierProvider } from "@/components/restaurant/PanierContext";

export default async function LayoutRestaurant({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) notFound();

  const variablesTheme = {
    "--primaire": restaurant.couleur_primaire,
    "--accent": restaurant.couleur_accent,
  } as CSSProperties;

  return (
    <div style={variablesTheme} className="flex min-h-screen flex-col">
      <PanierProvider>{children}</PanierProvider>
    </div>
  );
}
