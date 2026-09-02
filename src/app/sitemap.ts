import type { MetadataRoute } from "next";

import { listerArticles, listerEvenements } from "@/lib/donnees";
import { SITE_URL } from "@/lib/site";

const PAGES_STATIQUES = [
  "",
  "/a-propos",
  "/actions",
  "/evenements",
  "/actualites",
  "/galerie",
  "/adhesion",
  "/soutenir",
  "/contact",
  "/mentions-legales",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [evenements, articles] = await Promise.all([listerEvenements(), listerArticles()]);

  return [
    ...PAGES_STATIQUES.map((chemin) => ({
      url: `${SITE_URL}${chemin}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: chemin === "" ? 1 : 0.7,
    })),
    ...evenements.map((evenement) => ({
      url: `${SITE_URL}/evenements/${evenement.slug}`,
      lastModified: new Date(evenement.cree_le),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/actualites/${article.slug}`,
      lastModified: new Date(article.publie_le ?? article.cree_le),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
