import { ORGANISATION, PROGRAMMES, VISION } from "@/content/organisation";

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

export type TypeChamp = "texte" | "long" | "image";

export type ChampContenu = {
  cle: string;
  groupe: string;
  label: string;
  type: TypeChamp;
  aide?: string;
  /** Valeur affichée tant que rien n'a été saisi. */
  defaut: string;
};

export const CHAMPS_CONTENU: ChampContenu[] = [
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

export type Contenus = Record<string, string>;

/** Valeurs par défaut, utilisées tant que la base ne dit rien d'autre. */
export function contenusParDefaut(): Contenus {
  return Object.fromEntries(CHAMPS_CONTENU.map((champ) => [champ.cle, champ.defaut]));
}

/**
 * Fusionne les surcharges enregistrées avec les valeurs du code.
 * Une chaîne vide en base compte comme « pas de surcharge ».
 */
export function fusionnerContenus(
  lignes: Array<{ cle: string; valeur: string | null; image_url: string | null }> | null,
): Contenus {
  const contenus = contenusParDefaut();

  for (const ligne of lignes ?? []) {
    const valeur = (ligne.image_url ?? ligne.valeur ?? "").trim();
    if (valeur) contenus[ligne.cle] = valeur;
  }

  return contenus;
}
