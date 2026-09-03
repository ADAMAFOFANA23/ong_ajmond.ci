/**
 * Rôles de l'espace de gestion, calqués sur les organes statutaires.
 *
 * Le cloisonnement est porté en base par les politiques RLS
 * (`supabase/migrations/20260902200000_roles_backoffice.sql`). Ce module en
 * est le miroir côté interface : il décide quelles sections s'affichent et
 * quelles routes sont atteignables. Les deux doivent rester d'accord — si
 * vous ouvrez une section ici, ouvrez la politique correspondante là-bas.
 */

export const SECTIONS = [
  "tableau-de-bord",
  "adhesions",
  "membres",
  "evenements",
  "inscriptions",
  "articles",
  "galerie",
  "partenaires",
  "contenus",
  "messages",
  "roles",
] as const;

export type Section = (typeof SECTIONS)[number];

export type Role = "membre" | "admin" | "communication" | "tresorerie" | "secretariat";

export const ROLES: Record<
  Role,
  { nom: string; organe: string; description: string; sections: readonly Section[] }
> = {
  membre: {
    nom: "Membre",
    organe: "Assemblée Générale",
    description:
      "Accès à l'espace membre uniquement : ses cotisations, ses inscriptions et son profil.",
    sections: [],
  },
  admin: {
    nom: "Administrateur",
    organe: "Bureau Exécutif",
    description:
      "Accès complet à la gestion, y compris la distribution des rôles. À réserver au Bureau Exécutif.",
    sections: SECTIONS,
  },
  secretariat: {
    nom: "Secrétariat",
    organe: "Secrétariat Général · Affaires sociales",
    description:
      "Traite les demandes d'adhésion, les inscriptions aux événements et les messages reçus.",
    sections: ["tableau-de-bord", "adhesions", "inscriptions", "messages"],
  },
  tresorerie: {
    nom: "Trésorerie",
    organe: "Trésorerie Générale",
    description:
      "Tient le fichier des membres et enregistre les cotisations. N'accède ni aux contenus ni aux rôles.",
    sections: ["tableau-de-bord", "membres"],
  },
  communication: {
    nom: "Communication",
    organe: "Communication et informatique",
    description:
      "Publie les actualités, les événements, la galerie, les partenaires et les contenus du site. N'accède ni aux données financières ni aux adhésions.",
    sections: [
      "tableau-de-bord",
      "evenements",
      "articles",
      "galerie",
      "partenaires",
      "contenus",
    ],
  },
};

/** Rôles distribuables depuis l'écran des rôles, dans l'ordre d'affichage. */
export const ROLES_ATTRIBUABLES: Role[] = [
  "membre",
  "secretariat",
  "tresorerie",
  "communication",
  "admin",
];

/** Un rôle qui ouvre l'espace de gestion, quel qu'il soit. */
export function estGestionnaire(role: string | null | undefined): role is Role {
  return Boolean(role && role !== "membre" && role in ROLES);
}

export function sectionsDe(role: string | null | undefined): readonly Section[] {
  return role && role in ROLES ? ROLES[role as Role].sections : [];
}

export function peutAcceder(role: string | null | undefined, section: Section): boolean {
  return sectionsDe(role).includes(section);
}

/** Section correspondant à une route de l'espace de gestion. */
export function sectionDuChemin(chemin: string): Section {
  const segment = chemin.replace(/^\/admin\/?/, "").split("/")[0];
  if (!segment) return "tableau-de-bord";
  return (SECTIONS as readonly string[]).includes(segment)
    ? (segment as Section)
    : "tableau-de-bord";
}

/** Première section accessible : la destination de repli après un refus. */
export function accueilDe(role: string | null | undefined): string {
  const sections = sectionsDe(role);
  if (!sections.length) return "/espace-membre";
  return sections[0] === "tableau-de-bord" ? "/admin" : `/admin/${sections[0]}`;
}
