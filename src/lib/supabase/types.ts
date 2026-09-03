export type TypeMembre = "fondateur" | "actif" | "honneur" | "bienfaiteur";
export type StatutDemande = "nouvelle" | "en_cours" | "acceptee" | "refusee";
/** Miroir de l'énumération `role_utilisateur`. Voir `src/lib/roles.ts`. */
export type RoleUtilisateur =
  | "membre"
  | "admin"
  | "communication"
  | "tresorerie"
  | "secretariat";
export type TypePartenaire = "etablissement" | "technique" | "institutionnel" | "soutien";
export type StatutCotisation = "a_payer" | "payee" | "en_retard";
export type NatureCotisation = "adhesion" | "mensuelle" | "exceptionnelle" | "don";

export type Profil = {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string | null;
  profession: string | null;
  ville: string | null;
  type_membre: TypeMembre;
  role: RoleUtilisateur;
  actif: boolean;
  date_adhesion: string;
  cree_le: string;
};

export type DemandeAdhesion = {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  profession: string | null;
  ville: string | null;
  type_membre: TypeMembre;
  motivation: string;
  statut: StatutDemande;
  note_interne: string | null;
  cree_le: string;
};

export type Cotisation = {
  id: string;
  profil_id: string;
  nature: NatureCotisation;
  periode: string | null;
  montant: number;
  statut: StatutCotisation;
  paye_le: string | null;
  cree_le: string;
};

export type Evenement = {
  id: string;
  slug: string;
  titre: string;
  chapo: string | null;
  description: string | null;
  programme: string | null;
  etablissement: string | null;
  lieu: string | null;
  ville: string | null;
  debut_le: string;
  fin_le: string | null;
  capacite: number | null;
  image_url: string | null;
  inscriptions_ouvertes: boolean;
  publie: boolean;
  cree_le: string;
};

export type Inscription = {
  id: string;
  evenement_id: string;
  profil_id: string | null;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string | null;
  qualite: string | null;
  etablissement: string | null;
  statut: StatutDemande;
  cree_le: string;
};

export type Article = {
  id: string;
  slug: string;
  titre: string;
  chapo: string | null;
  contenu: string;
  categorie: string;
  couverture_url: string | null;
  auteur: string | null;
  publie: boolean;
  publie_le: string | null;
  cree_le: string;
};

export type Media = {
  id: string;
  titre: string;
  legende: string | null;
  url: string;
  lieu: string | null;
  prise_le: string | null;
  evenement_id: string | null;
  publie: boolean;
  cree_le: string;
};

export type MessageContact = {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string;
  message: string;
  traite: boolean;
  cree_le: string;
};

export type Partenaire = {
  id: string;
  nom: string;
  type: TypePartenaire;
  logo_url: string | null;
  site_url: string | null;
  ville: string | null;
  description: string | null;
  ordre: number;
  publie: boolean;
  cree_le: string;
};
