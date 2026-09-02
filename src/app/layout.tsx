import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import { Entete } from "@/components/layout/entete";
import { PiedDePage } from "@/components/layout/pied-de-page";
import { MOTS_CLES, ORGANISATION } from "@/content/organisation";
import { SITE_URL } from "@/lib/site";
import { profilCourant } from "@/lib/supabase/server";
import "./globals.css";

const policeTexte = Inter({
  subsets: ["latin"],
  variable: "--police-texte",
  display: "swap",
});

const policeTitre = Outfit({
  subsets: ["latin"],
  variable: "--police-titre",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${ORGANISATION.sigle} — ${ORGANISATION.nom}`,
    template: `%s · ${ORGANISATION.sigle}`,
  },
  description:
    "ONG ivoirienne de prévention des fléaux sociaux en milieu scolaire : sensibilisation, écoute, formation des encadreurs et réinsertion des jeunes.",
  keywords: MOTS_CLES,
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: ORGANISATION.sigle,
    title: `${ORGANISATION.sigle} — ${ORGANISATION.nom}`,
    description:
      "Promotion d'une jeunesse responsable : sensibilisation, écoute, formation et réinsertion dans les établissements secondaires de Côte d'Ivoire.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profil = await profilCourant();

  return (
    <html lang="fr" className={`${policeTexte.variable} ${policeTitre.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bleu-600 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Aller au contenu principal
        </a>
        <Entete connecte={Boolean(profil)} admin={profil?.role === "admin"} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}
