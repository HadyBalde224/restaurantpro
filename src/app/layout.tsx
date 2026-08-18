import type { Metadata } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

// VERCEL_URL est fourni automatiquement par Vercel une fois déployé (pas de
// configuration manuelle nécessaire) ; en local, on retombe sur localhost.
const origine = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(origine),
  title: "NEHMA",
  description: "Sites vitrines pour restaurants",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${playfairDisplay.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
