/**
 * Contenu institutionnel de l'ONG A.J.MOND-CI.
 * Source : Statuts et Règlement Intérieur 2019, Plan d'action 2021-2022,
 * Projet « Forum d'échanges, d'écoute, de conseils et de restauration » 2e édition 2024.
 */

export const ORGANISATION = {
  sigle: "A.J.MOND-CI",
  nom: "Amie des Jeunes du Monde de Côte d'Ivoire",
  nature: "Organisation Non Gouvernementale (ONG)",
  cadreLegal:
    "Régie par la loi n° 60-315 du 21 septembre 1960 relative aux associations. Apolitique et à but non lucratif.",
  siege: "Abidjan – Cocody (Cité SIR)",
  boitePostale: "22 BP 568 Abidjan 22",
  email: "ongajmondci2021@gmail.com",
  telephones: ["+225 07 09 29 96 91", "+225 07 08 52 02 86"],
  presidente: "BOTO Logbo Marie Madeleine",
};

export const VISION = {
  titre: "Promotion d'une jeunesse responsable",
  texte:
    "Favoriser l'adoption de comportements responsables face aux fléaux sociaux, chez les jeunes scolarisés comme déscolarisés, en allant à leur rencontre par la sensibilisation : conférences, projections, débats ouverts, échanges personnalisés, ateliers et sketchs.",
};

export const OBJECTIF_GENERAL =
  "Lutter efficacement contre les fléaux sociaux — drogue, alcool, tabac, violences, vol, tricherie, prostitution — et contre tous les vices capables de freiner l'éducation des jeunes.";

export const OBJECTIFS_SPECIFIQUES = [
  "Sensibiliser les jeunes contre la drogue, l'alcool, le tabac, les violences et la prostitution.",
  "Former les encadreurs et les acteurs aux techniques de sensibilisation.",
  "Suivre les interventions des cellules d'aide.",
  "Évaluer les cellules d'aide.",
  "Effectuer l'insertion et la réinsertion sociale et professionnelle des jeunes.",
];

export const MISSIONS = [
  {
    titre: "Suivi et encadrement social",
    description:
      "Un accompagnement de proximité des élèves repérés, avec des psychologues, des assistants sociaux et le personnel éducatif des établissements.",
    icone: "handshake",
  },
  {
    titre: "Formation, séminaires et ateliers",
    description:
      "Renforcement des capacités du personnel éducatif et des membres de l'ONG pour un meilleur suivi des élèves face aux addictions.",
    icone: "graduation",
  },
  {
    titre: "Espace de conseils",
    description:
      "Des espaces d'écoute, de conseils et de restauration où chaque jeune peut parler librement de sa situation et être orienté.",
    icone: "ear",
  },
  {
    titre: "Réinsertion",
    description:
      "Suivi post-hospitalisation, insertion et réinsertion sociale et professionnelle des jeunes sortis du parcours scolaire.",
    icone: "sprout",
  },
];

export const STRATEGIES = [
  "Sensibilisation de masse et de proximité",
  "Détection des bénéficiaires",
  "Formation des acteurs et des bénéficiaires",
  "Écoute et suivi",
  "Suivi et évaluation des actions",
  "Mise en œuvre de conventions et de partenariats",
  "Insertion et réinsertion sociale et professionnelle",
];

export const CIBLES = [
  {
    titre: "Élèves des lycées et collèges",
    detail:
      "De la sixième à la terminale, dans les établissements secondaires de Côte d'Ivoire.",
  },
  {
    titre: "Jeunes des zones vulnérables",
    detail: "Villes, quartiers et campements où les jeunes sont livrés à eux-mêmes.",
  },
  {
    titre: "Encadreurs et personnel éducatif",
    detail:
      "Éducateurs, assistants sociaux, animateurs formés aux techniques de sensibilisation.",
  },
];

export const CHIFFRES = [
  {
    valeur: "40 %",
    libelle: "des 10-20 ans enquêtés fument déjà la cigarette ou la drogue",
    source: "Enquête au Lycée Moderne d'Adzopé 1",
  },
  {
    valeur: "45 %",
    libelle: "des 20-25 ans enquêtés consomment drogue ou alcool",
    source: "Enquête au Lycée Moderne d'Adzopé 1",
  },
  {
    valeur: "37,4 %",
    libelle: "des hommes usagers de drogues ont entre 14 et 20 ans",
    source: "Rapport « Genre et usages de drogues en Côte d'Ivoire », 29 mai 2020",
  },
  {
    valeur: "47,4 %",
    libelle: "des femmes usagères de drogues ont entre 14 et 20 ans",
    source: "Rapport « Genre et usages de drogues en Côte d'Ivoire », 29 mai 2020",
  },
];

export const ORGANES = [
  {
    nom: "Assemblée Générale (AG)",
    role: "Composée de l'ensemble des membres actifs. Elle élit les organes, approuve les rapports et le bilan, adopte le budget et délibère sur toutes les questions qui lui sont soumises. Quorum : un tiers des membres actifs.",
  },
  {
    nom: "Bureau Exécutif (BE)",
    role: "Organe de direction, dirigé par un Président élu pour trois ans, rééligible une fois. Il comprend un Secrétaire Général et un chargé de la communication et de l'informatique.",
  },
  {
    nom: "Trésorerie Générale (TG)",
    role: "Élue pour trois ans. Elle assure la gestion financière, présente le rapport financier à chaque Assemblée Générale et cosigne avec le Président tout acte engageant financièrement l'ONG.",
  },
  {
    nom: "Commissariat aux comptes (CC)",
    role: "Élu pour trois ans. Il contrôle la gestion financière du Bureau Exécutif et de la Trésorerie et approuve le bilan financier devant l'Assemblée Générale.",
  },
  {
    nom: "Communication et informatique (CI)",
    role: "Publie les activités, assure les relations avec les médias, gère le site internet et les réseaux de l'ONG.",
  },
  {
    nom: "Chargé de mission aux affaires sociales (CMAS)",
    role: "Pilote l'accompagnement social des bénéficiaires et le lien avec les cellules d'aide.",
  },
  {
    nom: "Chargé des relations extérieures (CRE)",
    role: "Développe les partenariats avec les institutions, établissements, ONG et fondations.",
  },
];

export const TYPES_MEMBRES = [
  {
    cle: "fondateur",
    nom: "Membre fondateur",
    description:
      "Personne ayant pris part à l'Assemblée Générale constitutive et œuvrant activement à la consolidation de l'ONG. Membre de droit.",
  },
  {
    cle: "actif",
    nom: "Membre actif / adhérent",
    description:
      "Participe activement aux activités statutaires, s'acquitte du droit d'adhésion et des cotisations. Éligible à tout poste électif et dispose du droit de vote.",
  },
  {
    cle: "honneur",
    nom: "Membre d'honneur",
    description:
      "Désigné par le Bureau Exécutif pour services rendus. Dispensé de cotisation, il participe aux Assemblées Générales avec voix délibérative.",
  },
  {
    cle: "bienfaiteur",
    nom: "Membre bienfaiteur",
    description:
      "Contribue par ses actions génératrices de ressources et participe aux activités de l'ONG.",
  },
];

export const COTISATIONS = {
  adhesion: 5000,
  mensuelle: 1000,
  devise: "FCFA",
  note: "Droit d'adhésion payé en une seule fois, puis cotisation mensuelle. S'y ajoutent les cotisations exceptionnelles, les contributions libres des membres d'honneur, les dons et legs, les subventions et les produits des activités.",
};

export const PROGRAMMES = [
  {
    slug: "forum-echanges-ecoute-conseils",
    titre: "Forum d'échanges, d'écoute, de conseils et de restauration",
    accroche:
      "Une journée complète dans un établissement secondaire, autour du développement personnel.",
    edition: "2e édition — 2024",
    description:
      "Le forum réunit sur une matinée les élèves d'un lycée, des psychologues, des médecins psychiatres, des spécialistes des sciences de l'éducation et le personnel éducatif. Exposés, ateliers en petits groupes puis restitution en plénière : les élèves repartent avec des repères concrets pour résister aux influences et construire leur projet personnel.",
    deroule: [
      { horaire: "07h00 – 07h30", intitule: "Mise en place et installation des autorités" },
      { horaire: "07h30 – 08h00", intitule: "Animation" },
      { horaire: "08h00 – 09h00", intitule: "Exposé — psychologie sociale et clinique" },
      { horaire: "09h00 – 10h00", intitule: "Exposé — sciences de l'éducation" },
      {
        horaire: "10h00 – 11h00",
        intitule: "Exposé — santé publique et lutte contre le tabagisme",
      },
      { horaire: "11h00 – 11h30", intitule: "Travaux en atelier" },
      { horaire: "11h30 – 12h15", intitule: "Mise en commun et restitution des plénières" },
      { horaire: "12h15 – 12h30", intitule: "Mot de fin et photos" },
    ],
  },
  {
    slug: "sensibilisation-prevention",
    titre: "Sensibilisation, prévention, écoute et suivi",
    accroche: "Des interventions régulières dans les lycées avec une équipe de psychologues.",
    edition: "Depuis 2019",
    description:
      "Conférences-débats, projections, sketchs et échanges personnalisés menés dans les établissements avec l'équipe de psychologues du CIERPA. Thème récurrent : « Quelle personnalité pour résister aux influences des consommateurs de drogues ? ». Chaque intervention se prolonge par des séances d'écoute individuelle.",
    deroule: [],
  },
  {
    slug: "formation-encadreurs",
    titre: "Formation des encadreurs",
    accroche: "Renforcer les capacités du personnel éducatif face aux addictions.",
    edition: "Programme continu",
    description:
      "Ateliers de renforcement de capacités destinés au personnel éducatif des établissements et aux membres de l'ONG, pour un meilleur repérage et un meilleur suivi des élèves concernés par la drogue, l'alcool ou le tabac.",
    deroule: [],
  },
  {
    slug: "centre-accueil-reinsertion",
    titre: "Centre d'accueil et réinsertion",
    accroche: "Suivi post-hospitalisation, insertion et réinsertion sociale et professionnelle.",
    edition: "Projet en cours",
    description:
      "Ouverture d'un centre d'accueil pour héberger et accompagner les jeunes en rupture : suivi post-hospitalisation, remise à niveau, orientation et réinsertion sociale et professionnelle.",
    deroule: [],
  },
];

export const ETABLISSEMENTS_PARTENAIRES = [
  "Lycée Mamie Faitai de Bingerville",
  "Lycée Garçons de Bingerville",
  "Lycée Sainte-Marie de Cocody",
  "Lycée Classique de Cocody",
  "Lycée Moderne de Cocody",
  "Lycée Moderne d'Angré / Cocody",
  "Lycée Moderne 1 d'Adzopé",
];

export const HISTORIQUE = [
  {
    annee: "2019",
    titre: "Adoption des statuts et du règlement intérieur",
    texte:
      "L'ONG se dote de son cadre statutaire et lance ses premières conférences, notamment au Lycée Moderne 1 d'Adzopé sur les méfaits de la drogue en milieu scolaire.",
  },
  {
    annee: "2020",
    titre: "Consommation de drogues et déperditions scolaires",
    texte:
      "Conférence du 26 février autour des liens entre consommation de substances et abandon scolaire, avec la Direction de la Police des Stupéfiants et de la Drogue.",
  },
  {
    annee: "2021",
    titre: "Déploiement sur la DREN Abidjan",
    texte:
      "Interventions au Lycée Mamie Faitai de Bingerville et au Lycée Moderne de Cocody, avec l'appui de chercheurs du CIERPA.",
  },
  {
    annee: "2022",
    titre: "Plan d'action national",
    texte:
      "Structuration du plan d'action : sensibilisation, formation des encadreurs et projet de centre d'accueil à Adzopé.",
  },
  {
    annee: "2024",
    titre: "2e édition du Forum d'échanges",
    texte:
      "Six établissements de la DREN Abidjan-1 programmés de février à mai, pour un budget prévisionnel de 39 780 000 FCFA.",
  },
];

export const PARTENAIRES_TECHNIQUES = [
  "CIERPA – UFR Cocody (psychologie sociale et clinique)",
  "Département des sciences de l'éducation, UFR Cocody",
  "Ministère de la Santé et de l'Hygiène Publique (PNLTA)",
  "DREN Abidjan-1",
  "Établissements secondaires partenaires",
];

/**
 * Mots-clés de référencement, repris par les métadonnées du site.
 *
 * Ordonnés du plus spécifique au plus générique : identité de l'ONG, puis
 * implantation, puis thématiques d'intervention. Les variantes de graphie du
 * sigle sont volontaires — le public tape rarement les points.
 */
export const MOTS_CLES = [
  // Identité
  "A.J.MOND-CI",
  "AJMOND-CI",
  "AJMOND",
  "Amie des Jeunes du Monde de Côte d'Ivoire",
  "ONG AJMOND",

  // Implantation
  "ONG Côte d'Ivoire",
  "ONG Abidjan",
  "Cocody",
  "Bingerville",
  "Adzopé",

  // Thématiques
  "prévention des fléaux sociaux",
  "lutte contre la drogue",
  "prévention drogue en milieu scolaire",
  "alcool",
  "tabac",
  "addiction",
  "sensibilisation des jeunes",
  "milieu scolaire",
  "lycée",
  "collège",
  "jeunesse",
  "écoute et conseils",
  "formation des encadreurs",
  "insertion et réinsertion sociale",
  "accompagnement psychologique",
];

export const NAVIGATION = [
  { href: "/a-propos", label: "L'ONG" },
  { href: "/actions", label: "Nos actions" },
  { href: "/evenements", label: "Événements" },
  { href: "/actualites", label: "Actualités" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];
