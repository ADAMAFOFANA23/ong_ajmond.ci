import {
  CHIFFRES,
  COTISATIONS,
  HISTORIQUE,
  MISSIONS,
  OBJECTIF_GENERAL,
  ORGANISATION,
  PROGRAMMES,
  TYPES_MEMBRES,
  VISION,
} from "@/content/organisation";

/**
 * Contenus du site modifiables depuis l'espace de gestion.
 *
 * Chaque entrée est une *surcharge* : tant que le bureau n'a rien saisi, le
 * site affiche la valeur livrée dans le code, tirée des statuts et des
 * documents de l'ONG. Vider un champ revient donc à revenir au texte
 * d'origine, jamais à laisser un blanc.
 *
 * Ajouter un contenu éditable = ajouter une ligne ici. Le formulaire
 * d'administration et la lecture côté site s'y adaptent seuls.
 */

export type TypeChamp = "texte" | "long" | "nombre" | "image" | "liste";

/** Colonne d'une liste répétable. */
export type ColonneListe = {
  nom: string;
  label: string;
  type: "texte" | "long";
  aide?: string;
};

export type ChampContenu = {
  cle: string;
  groupe: string;
  label: string;
  type: TypeChamp;
  aide?: string;
  /** Valeur affichée tant que rien n'a été saisi. */
  defaut: string;
  /** Pour `liste` seulement : les colonnes d'une ligne. */
  colonnes?: ColonneListe[];
  /** Pour `liste` seulement : les lignes livrées dans le code. */
  lignesParDefaut?: LigneListe[];
};

export type LigneListe = Record<string, string>;

export const CHAMPS_CONTENU: ChampContenu[] = [
  /* ------------------------------------------------------- Page d'accueil */
  {
    cle: "accueil.titre",
    groupe: "Page d'accueil",
    label: "Titre principal",
    type: "texte",
    aide: "Le grand titre du bandeau d'ouverture.",
    defaut: VISION.titre,
  },
  {
    cle: "accueil.chapo",
    groupe: "Page d'accueil",
    label: "Texte d'introduction",
    type: "long",
    defaut:
      "L'ONG va à la rencontre des élèves des lycées et collèges de Côte d'Ivoire contre la drogue, l'alcool, le tabac, les violences et la prostitution — par la sensibilisation, l'écoute, la formation des encadreurs et la réinsertion.",
  },
  {
    cle: "accueil.photo_hero",
    groupe: "Page d'accueil",
    label: "Photo du bandeau",
    type: "image",
    aide: "Portrait vertical, 1200 × 1500 px. Sans photo, l'emplacement reste visible comme à fournir.",
    defaut: "",
  },
  {
    cle: "accueil.photo_forum",
    groupe: "Page d'accueil",
    label: "Photo du Forum",
    type: "image",
    aide: "Format paysage, 1400 × 900 px.",
    defaut: "",
  },
  {
    cle: "accueil.forum_description",
    groupe: "Page d'accueil",
    label: "Présentation du Forum",
    type: "long",
    defaut: PROGRAMMES[0].description,
  },
  {
    cle: "accueil.contact_titre",
    groupe: "Page d'accueil",
    label: "Titre du bloc de contact",
    type: "texte",
    defaut: "Un élève vous inquiète, un établissement veut nous recevoir ?",
  },

  /* ------------------------------------------------ Contenus statutaires */
  {
    cle: "statuts.objectif_general",
    groupe: "Contenus statutaires",
    label: "Objectif général",
    type: "long",
    aide: "Affiché en tête de la section « Ce que disent les enquêtes ».",
    defaut: OBJECTIF_GENERAL,
  },
  {
    cle: "statuts.chiffres",
    groupe: "Contenus statutaires",
    label: "Chiffres d'enquête",
    type: "liste",
    aide: "Chaque chiffre porte sa source. Ne rien afficher sans origine vérifiable.",
    defaut: "",
    colonnes: [
      { nom: "valeur", label: "Chiffre", type: "texte", aide: "Par exemple « 40 % »." },
      { nom: "libelle", label: "Ce qu'il mesure", type: "long" },
      { nom: "source", label: "Source", type: "texte" },
    ],
    lignesParDefaut: CHIFFRES.map((c) => ({
      valeur: c.valeur,
      libelle: c.libelle,
      source: c.source,
    })),
  },
  {
    cle: "statuts.missions",
    groupe: "Contenus statutaires",
    label: "Missions statutaires",
    type: "liste",
    defaut: "",
    colonnes: [
      { nom: "titre", label: "Titre", type: "texte" },
      { nom: "description", label: "Description", type: "long" },
    ],
    lignesParDefaut: MISSIONS.map((m) => ({ titre: m.titre, description: m.description })),
  },
  {
    cle: "statuts.historique",
    groupe: "Contenus statutaires",
    label: "Repères chronologiques",
    type: "liste",
    aide: "Affichés dans l'ordre de la liste, du plus ancien au plus récent.",
    defaut: "",
    colonnes: [
      { nom: "annee", label: "Année", type: "texte" },
      { nom: "titre", label: "Titre", type: "texte" },
      { nom: "texte", label: "Texte", type: "long" },
    ],
    lignesParDefaut: HISTORIQUE.map((h) => ({
      annee: h.annee,
      titre: h.titre,
      texte: h.texte,
    })),
  },
  {
    cle: "statuts.types_membres",
    groupe: "Contenus statutaires",
    label: "Qualités de membre",
    type: "liste",
    aide: "Reprises des statuts. Les modifier ici ne change pas les types en base de données.",
    defaut: "",
    colonnes: [
      { nom: "nom", label: "Intitulé", type: "texte" },
      { nom: "description", label: "Description", type: "long" },
    ],
    lignesParDefaut: TYPES_MEMBRES.map((t) => ({ nom: t.nom, description: t.description })),
  },

  /* ------------------------------------------------------------ Cotisations */
  {
    cle: "cotisation.adhesion",
    groupe: "Cotisations",
    label: "Droit d'adhésion (FCFA)",
    type: "nombre",
    defaut: String(COTISATIONS.adhesion),
  },
  {
    cle: "cotisation.mensuelle",
    groupe: "Cotisations",
    label: "Cotisation mensuelle (FCFA)",
    type: "nombre",
    defaut: String(COTISATIONS.mensuelle),
  },
  {
    cle: "cotisation.note",
    groupe: "Cotisations",
    label: "Note sur les cotisations",
    type: "long",
    defaut: COTISATIONS.note,
  },

  /* ------------------------------------------------------------ Coordonnées */
  {
    cle: "organisation.email",
    groupe: "Coordonnées",
    label: "Adresse e-mail",
    type: "texte",
    defaut: ORGANISATION.email,
  },
  {
    cle: "organisation.telephone1",
    groupe: "Coordonnées",
    label: "Téléphone principal",
    type: "texte",
    defaut: ORGANISATION.telephones[0],
  },
  {
    cle: "organisation.telephone2",
    groupe: "Coordonnées",
    label: "Téléphone secondaire",
    type: "texte",
    defaut: ORGANISATION.telephones[1] ?? "",
  },
  {
    cle: "organisation.siege",
    groupe: "Coordonnées",
    label: "Siège",
    type: "texte",
    defaut: ORGANISATION.siege,
  },
  {
    cle: "organisation.boite_postale",
    groupe: "Coordonnées",
    label: "Boîte postale",
    type: "texte",
    defaut: ORGANISATION.boitePostale,
  },
];

export const GROUPES_CONTENU = [...new Set(CHAMPS_CONTENU.map((champ) => champ.groupe))];

export const CHAMPS_LISTE = CHAMPS_CONTENU.filter((champ) => champ.type === "liste");

export type Contenus = {
  /** Champs simples : texte, texte long, nombre, image. */
  textes: Record<string, string>;
  /** Champs de type liste. */
  listes: Record<string, LigneListe[]>;
};

export function contenusParDefaut(): Contenus {
  const textes: Record<string, string> = {};
  const listes: Record<string, LigneListe[]> = {};

  for (const champ of CHAMPS_CONTENU) {
    if (champ.type === "liste") listes[champ.cle] = champ.lignesParDefaut ?? [];
    else textes[champ.cle] = champ.defaut;
  }

  return { textes, listes };
}

/**
 * Fusionne les surcharges enregistrées avec les valeurs du code.
 *
 * Une chaîne vide ou une liste vide comptent comme « pas de surcharge » : on
 * ne peut donc pas vider une section par mégarde, seulement la remplacer.
 */
export function fusionnerContenus(
  lignes:
    | Array<{
        cle: string;
        valeur: string | null;
        image_url: string | null;
        donnees: unknown;
      }>
    | null,
): Contenus {
  const contenus = contenusParDefaut();

  for (const ligne of lignes ?? []) {
    if (Array.isArray(ligne.donnees) && ligne.donnees.length > 0) {
      contenus.listes[ligne.cle] = ligne.donnees as LigneListe[];
      continue;
    }

    const valeur = (ligne.image_url ?? ligne.valeur ?? "").trim();
    if (valeur) contenus.textes[ligne.cle] = valeur;
  }

  return contenus;
}

/** Montant lu depuis les contenus, avec repli sur la valeur du code. */
export function nombreContenu(contenus: Contenus, cle: string, repli: number): number {
  const brut = Number.parseInt(contenus.textes[cle] ?? "", 10);
  return Number.isFinite(brut) ? brut : repli;
}
