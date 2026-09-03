import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { MOTS_CLES, ORGANISATION } from "@/content/organisation";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const policeTexte = Inter({
  subsets: ["latin"],
  variable: "--police-texte",
  display: "swap",
});

/**
 * Serif à axes variables, dessinée pour les grandes tailles. Elle porte la
 * gravité institutionnelle que la photographie d'architecture portait dans le
 * template de référence, que ce projet n'a pas.
 */
const policeTitre = Fraunces({
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
    "ONG ivoirienne de prévention des fléaux sociaux en milieu scolaire : sensibilisation, écoute, formation des encadreurs et réinsertion.",
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

/**
 * Racine minimale : polices, styles et lien d'évitement.
 *
 * L'en-tête et le pied de page publics appartiennent au groupe `(site)`.
 * L'administration a sa propre coque plein écran et n'hérite d'aucun chrome
 * de site vitrine.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${policeTexte.variable} ${policeTitre.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brique-500 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
