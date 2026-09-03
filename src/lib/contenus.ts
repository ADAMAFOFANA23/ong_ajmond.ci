import {
  CHIFFRES,
  CIBLES,
  COTISATIONS,
  HISTORIQUE,
  MISSIONS,
  OBJECTIF_GENERAL,
  OBJECTIFS_SPECIFIQUES,
  ORGANES,
  ORGANISATION,
  PROGRAMMES,
  STRATEGIES,
  TYPES_MEMBRES,
  VISION,
} from "@/content/organisation";

/** Une étape par ligne, « horaire | intitulé ». */
function derouleEnTexte(deroule: Array<{ horaire: string; intitule: string }>): string {
  return deroule.map((etape) => `${etape.horaire} | ${etape.intitule}`).join("\n");
}

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

  {
    cle: "statuts.vision_titre",
    groupe: "Contenus statutaires",
    label: "Vision — titre",
    type: "texte",
    aide: "Affiché sur la page « L'ONG ». Le bandeau d'accueil a son propre titre.",
    defaut: VISION.titre,
  },
  {
    cle: "statuts.vision_texte",
    groupe: "Contenus statutaires",
    label: "Vision — texte",
    type: "long",
    defaut: VISION.texte,
  },
  {
    cle: "statuts.objectifs_specifiques",
    groupe: "Contenus statutaires",
    label: "Objectifs spécifiques",
    type: "liste",
    defaut: "",
    colonnes: [{ nom: "texte", label: "Objectif", type: "long" }],
    lignesParDefaut: OBJECTIFS_SPECIFIQUES.map((texte) => ({ texte })),
  },
  {
    cle: "statuts.strategies",
    groupe: "Contenus statutaires",
    label: "Stratégies d'intervention",
    type: "liste",
    aide: "Affichées numérotées dans l'ordre de la liste, sur « L'ONG » et « Nos actions ».",
    defaut: "",
    colonnes: [{ nom: "texte", label: "Étape", type: "texte" }],
    lignesParDefaut: STRATEGIES.map((texte) => ({ texte })),
  },
  {
    cle: "statuts.cibles",
    groupe: "Contenus statutaires",
    label: "Bénéficiaires",
    type: "liste",
    defaut: "",
    colonnes: [
      { nom: "titre", label: "Public", type: "texte" },
      { nom: "detail", label: "Précision", type: "long" },
    ],
    lignesParDefaut: CIBLES.map((c) => ({ titre: c.titre, detail: c.detail })),
  },
  {
    cle: "statuts.organes",
    groupe: "Contenus statutaires",
    label: "Organes statutaires",
    type: "liste",
    defaut: "",
    colonnes: [
      { nom: "nom", label: "Organe", type: "texte" },
      { nom: "role", label: "Rôle", type: "long" },
    ],
    lignesParDefaut: ORGANES.map((o) => ({ nom: o.nom, role: o.role })),
  },
  {
    cle: "identite.cadre_legal",
    groupe: "Contenus statutaires",
    label: "Cadre légal",
    type: "long",
    defaut: ORGANISATION.cadreLegal,
  },
  {
    cle: "identite.presidence",
    groupe: "Contenus statutaires",
    label: "Présidence",
    type: "texte",
    defaut: ORGANISATION.presidente,
  },

  /* ------------------------------------------------------------ Programmes */
  {
    cle: "programmes.liste",
    groupe: "Programmes",
    label: "Programmes de l'ONG",
    type: "liste",
    aide: "Le premier programme alimente aussi le bloc « Forum » de la page d'accueil.",
    defaut: "",
    colonnes: [
      { nom: "titre", label: "Titre", type: "texte" },
      { nom: "accroche", label: "Accroche", type: "texte" },
      { nom: "edition", label: "Édition ou période", type: "texte" },
      { nom: "description", label: "Description", type: "long" },
      {
        nom: "deroule",
        label: "Déroulé",
        type: "long",
        aide: "Une étape par ligne, sous la forme « 07h00 – 07h30 | Mise en place ». Laisser vide si le programme n'a pas d'horaire.",
      },
    ],
    lignesParDefaut: PROGRAMMES.map((p) => ({
      titre: p.titre,
      accroche: p.accroche,
      edition: p.edition,
      description: p.description,
      deroule: derouleEnTexte(p.deroule),
    })),
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

/** Étapes d'un programme, une par ligne : « horaire | intitulé ». */
export function etapesDuDeroule(brut: string | undefined): Array<{ horaire: string; intitule: string }> {
  if (!brut) return [];

  return brut
    .split("\n")
    .map((ligne) => ligne.trim())
    .filter(Boolean)
    .map((ligne) => {
      const separateur = ligne.indexOf("|");
      if (separateur === -1) return { horaire: "", intitule: ligne };
      return {
        horaire: ligne.slice(0, separateur).trim(),
        intitule: ligne.slice(separateur + 1).trim(),
      };
    });
}

/**
 * Identifiant stable dérivé d'un intitulé : sert d'ancre dans l'URL et de
 * graine au visuel. Les programmes n'ont plus de `slug` propre depuis qu'ils
 * sont éditables — le titre en tient lieu.
 */
export function identifiantDepuis(intitule: string): string {
  return intitule
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
