/**
 * Résolution des variables d'environnement Supabase.
 *
 * On accepte les noms standards ainsi que ceux injectés par l'intégration
 * Supabase de Vercel, afin que le projet fonctionne dans les deux cas.
 *
 * Chaque `process.env.X` est écrit en accès direct : Next.js remplace ces
 * expressions par leur valeur au build, et seule cette forme statique est
 * « inlinée » dans le bundle navigateur (un accès dynamique `process.env[n]`
 * renverrait `undefined` côté client).
 */

/** Première valeur réellement renseignée : `??` ne filtrerait pas les chaînes vides. */
function premiere(...valeurs: (string | undefined)[]): string {
  for (const valeur of valeurs) {
    const propre = valeur?.trim();
    if (propre) return propre;
  }
  return "";
}

/**
 * Normalise l'URL du projet vers la forme attendue par l'API Supabase
 * (`https://<ref>.supabase.co`). Tolère une chaîne de connexion Postgres ou un
 * hôte nu, deux valeurs souvent copiées par erreur depuis le tableau de bord.
 */
function normaliserUrl(valeur: string): string {
  if (!valeur) return "";

  const sansBarre = valeur.replace(/\/+$/, "");

  // postgresql://…@db.<ref>.supabase.co:5432/postgres → https://<ref>.supabase.co
  const dsn = /^postgres(?:ql)?:\/\/.*@db\.([a-z0-9]+)\.supabase\.(co|in)\b/i.exec(sansBarre);
  if (dsn) return `https://${dsn[1]}.supabase.${dsn[2]}`;

  // Hôte fourni sans protocole.
  if (!/^https?:\/\//i.test(sansBarre)) {
    return /^[\w.-]+\.supabase\.(co|in)$/i.test(sansBarre) ? `https://${sansBarre}` : "";
  }

  try {
    return new URL(sansBarre).origin;
  } catch {
    return "";
  }
}

export const SUPABASE_URL = normaliserUrl(
  premiere(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  ),
);

export const SUPABASE_ANON_KEY = premiere(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.SUPABASE_ANON_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

export const SUPABASE_SERVICE_ROLE_KEY = premiere(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  process.env.SUPABASE_SECRET_KEY,
);

export const supabaseConfigure = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Détail de ce qui manque, pour afficher un message actionnable plutôt qu'un
 * « pas encore configuré » qui ne dit pas quoi corriger.
 */
export function raisonSupabaseAbsent(): string | null {
  if (supabaseConfigure) return null;

  const manquants: string[] = [];
  if (!SUPABASE_URL) manquants.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_ANON_KEY) manquants.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return `Variables Supabase manquantes ou invalides : ${manquants.join(", ")}. Renseignez-les dans .env.local (URL du projet au format https://<ref>.supabase.co), puis redémarrez le serveur.`;
}
