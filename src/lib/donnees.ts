import "server-only";

import { creerClientServeur } from "@/lib/supabase/server";
import type { Article, Cotisation, Evenement, Media, Partenaire } from "@/lib/supabase/types";
import { contenusParDefaut, fusionnerContenus, type Contenus } from "@/lib/contenus";

/* ------------------------------------------------------------ Événements */

export async function listerEvenements(options?: { aVenir?: boolean; limite?: number }) {
  const supabase = await creerClientServeur();
  if (!supabase) return [] as Evenement[];

  let requete = supabase.from("evenements").select("*").eq("publie", true);

  if (options?.aVenir === true) {
    requete = requete.gte("debut_le", new Date().toISOString()).order("debut_le", { ascending: true });
  } else if (options?.aVenir === false) {
    requete = requete.lt("debut_le", new Date().toISOString()).order("debut_le", { ascending: false });
  } else {
    requete = requete.order("debut_le", { ascending: false });
  }

  if (options?.limite) requete = requete.limit(options.limite);

  const { data } = await requete;
  return (data ?? []) as Evenement[];
}

export async function trouverEvenement(slug: string) {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const { data } = await supabase.from("evenements").select("*").eq("slug", slug).maybeSingle();
  return (data as Evenement) ?? null;
}

/* -------------------------------------------------------------- Articles */

export async function listerArticles(limite?: number) {
  const supabase = await creerClientServeur();
  if (!supabase) return [] as Article[];

  let requete = supabase
    .from("articles")
    .select("*")
    .eq("publie", true)
    .order("publie_le", { ascending: false, nullsFirst: false });

  if (limite) requete = requete.limit(limite);

  const { data } = await requete;
  return (data ?? []) as Article[];
}

export async function trouverArticle(slug: string) {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const { data } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  return (data as Article) ?? null;
}

/* ---------------------------------------------------------------- Médias */

export async function listerMedias(limite?: number) {
  const supabase = await creerClientServeur();
  if (!supabase) return [] as Media[];

  let requete = supabase
    .from("medias")
    .select("*")
    .eq("publie", true)
    .order("prise_le", { ascending: false, nullsFirst: false });

  if (limite) requete = requete.limit(limite);

  const { data } = await requete;
  return (data ?? []) as Media[];
}

/* ----------------------------------------------------------- Cotisations */

export async function listerCotisations(profilId: string) {
  const supabase = await creerClientServeur();
  if (!supabase) return [] as Cotisation[];

  const { data } = await supabase
    .from("cotisations")
    .select("*")
    .eq("profil_id", profilId)
    .order("cree_le", { ascending: false });

  return (data ?? []) as Cotisation[];
}

export async function listerMesInscriptions(profilId: string) {
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const { data } = await supabase
    .from("inscriptions")
    .select("id, statut, cree_le, evenements ( slug, titre, debut_le, etablissement, ville )")
    .eq("profil_id", profilId)
    .order("cree_le", { ascending: false });

  type Ligne = {
    id: string;
    statut: string;
    cree_le: string;
    evenements:
      | {
          slug: string;
          titre: string;
          debut_le: string;
          etablissement: string | null;
          ville: string | null;
        }
      | Array<{
          slug: string;
          titre: string;
          debut_le: string;
          etablissement: string | null;
          ville: string | null;
        }>
      | null;
  };

  // Supabase renvoie la relation sous forme de tableau selon la configuration :
  // on normalise vers un objet unique.
  return ((data ?? []) as unknown as Ligne[]).map((ligne) => ({
    id: ligne.id,
    statut: ligne.statut,
    cree_le: ligne.cree_le,
    evenement: Array.isArray(ligne.evenements) ? (ligne.evenements[0] ?? null) : ligne.evenements,
  }));
}

/**
 * Contenus du site : surcharges enregistrées par le bureau, complétées par
 * les valeurs livrées dans le code. Ne lève jamais — un site public ne doit
 * pas tomber parce qu'une table de configuration est absente.
 */
export async function lireContenus(): Promise<Contenus> {
  const supabase = await creerClientServeur();
  if (!supabase) return contenusParDefaut();

  const { data } = await supabase
    .from("contenus_site")
    .select("cle, valeur, image_url, donnees");
  return fusionnerContenus(data ?? null);
}

/**
 * Partenaires publiés, groupés par type et ordonnés.
 * Renvoie une liste vide plutôt que de lever : la page d'accueil retombe
 * alors sur les listes livrées dans le code.
 */
export async function listerPartenaires(): Promise<Partenaire[]> {
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const { data } = await supabase
    .from("partenaires")
    .select("*")
    .eq("publie", true)
    .order("type")
    .order("ordre")
    .order("nom");

  return (data ?? []) as Partenaire[];
}

/* ------------------------------------------------ Fil d'actualité */

export type EntreeFil = {
  cle: string;
  type: "evenement" | "actualite";
  titre: string;
  chapo: string | null;
  date: string;
  href: string;
  imageUrl: string | null;
  graine: string;
  aVenir: boolean;
  lieu: string | null;
};

/**
 * Fil mêlant actualités et événements publiés.
 *
 * L'ordre n'est pas purement chronologique : ce qui n'a pas encore eu lieu
 * passe devant, du plus proche au plus lointain, parce que c'est ce sur quoi
 * un visiteur peut encore agir. Le reste suit, du plus récent au plus ancien.
 */
export async function listerFilActualite(limite = 12): Promise<EntreeFil[]> {
  const supabase = await creerClientServeur();
  if (!supabase) return [];

  const [{ data: evenements }, { data: articles }] = await Promise.all([
    supabase
      .from("evenements")
      .select("id, slug, titre, chapo, debut_le, image_url, etablissement, ville")
      .eq("publie", true)
      .order("debut_le", { ascending: false })
      .limit(limite),
    supabase
      .from("articles")
      .select("id, slug, titre, chapo, publie_le, cree_le, couverture_url, categorie")
      .eq("publie", true)
      .order("publie_le", { ascending: false })
      .limit(limite),
  ]);

  const maintenant = Date.now();

  const entrees: EntreeFil[] = [
    ...((evenements ?? []) as Array<Record<string, string | null>>).map((e) => ({
      cle: `evenement-${e.id}`,
      type: "evenement" as const,
      titre: String(e.titre),
      chapo: e.chapo,
      date: String(e.debut_le),
      href: `/evenements/${e.slug}`,
      imageUrl: e.image_url,
      graine: String(e.slug),
      aVenir: new Date(String(e.debut_le)).getTime() >= maintenant,
      lieu: [e.etablissement, e.ville].filter(Boolean).join(" · ") || null,
    })),
    ...((articles ?? []) as Array<Record<string, string | null>>).map((a) => ({
      cle: `actualite-${a.id}`,
      type: "actualite" as const,
      titre: String(a.titre),
      chapo: a.chapo,
      date: String(a.publie_le ?? a.cree_le),
      href: `/actualites/${a.slug}`,
      imageUrl: a.couverture_url,
      graine: String(a.slug),
      aVenir: false,
      lieu: a.categorie,
    })),
  ];

  return entrees
    .sort((a, b) => {
      if (a.aVenir !== b.aVenir) return a.aVenir ? -1 : 1;
      // À venir : le plus proche d'abord. Passé : le plus récent d'abord.
      return a.aVenir
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    })
    .slice(0, limite);
}
