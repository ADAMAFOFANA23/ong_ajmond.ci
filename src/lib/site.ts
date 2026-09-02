/**
 * URL canonique du site, partagée par les métadonnées, robots.txt et le sitemap.
 *
 * Trois sources, par ordre de priorité :
 *
 * 1. `NEXT_PUBLIC_SITE_URL` : la configuration explicite, qui prime toujours.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` : le domaine de production injecté par
 *    Vercel, utile tant que le domaine définitif n'est pas rattaché.
 * 3. `http://localhost:3000` pour le développement.
 *
 * Chaque repli couvre la chaîne vide, et pas seulement `undefined` : une
 * variable déclarée « Sensitive » chez Vercel n'est déchiffrée qu'à l'exécution
 * et vaut "" pendant le build. `??` ne rattrape pas ce cas, et `new URL("")`
 * lève alors `TypeError: Invalid URL`, ce qui fait échouer le build entier.
 *
 * La barre oblique finale est retirée : les appelants concatènent des chemins
 * qui commencent déjà par « / ».
 */
function resoudreUrlSite(): string {
  const explicite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const domaineVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  const brut =
    explicite || (domaineVercel ? `https://${domaineVercel}` : "") || "http://localhost:3000";

  const avecProtocole = /^https?:\/\//i.test(brut) ? brut : `https://${brut}`;

  try {
    return new URL(avecProtocole).origin;
  } catch {
    // Valeur inexploitable : mieux vaut un sitemap pointant sur localhost
    // qu'un build qui échoue.
    return "http://localhost:3000";
  }
}

export const SITE_URL = resoudreUrlSite();
