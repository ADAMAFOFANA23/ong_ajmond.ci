"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { CHAMPS_CONTENU } from "@/lib/contenus";
import { peutAcceder, ROLES, ROLES_ATTRIBUABLES, type Section } from "@/lib/roles";
import { creerClientServeur } from "@/lib/supabase/server";
import { MESSAGE_SUPABASE_ABSENT, type EtatFormulaire } from "./etat";

/**
 * Client serveur réservé aux rôles qui ont accès à `section`.
 *
 * Les politiques RLS refuseraient déjà l'écriture, mais elles le font en
 * silence : ce garde-fou permet de renvoyer un message plutôt qu'un échec
 * muet, et évite de révéler l'existence d'une donnée par un effet de bord.
 */
async function clientGestion(section: Section) {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profils").select("role").eq("id", user.id).single();
  if (!peutAcceder(data?.role, section)) return null;

  return supabase;
}

/* ---------------------------------------------------- Demandes d'adhésion */

export async function changerStatutDemande(donnees: FormData): Promise<void> {
  const supabase = await clientGestion("adhesions");
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  const statut = String(donnees.get("statut") ?? "");
  if (!id || !["nouvelle", "en_cours", "acceptee", "refusee"].includes(statut)) return;

  await supabase.from("demandes_adhesion").update({ statut }).eq("id", id);
  revalidatePath("/admin/adhesions");
}

/* ------------------------------------------------------------- Messages */

export async function basculerTraitementMessage(donnees: FormData): Promise<void> {
  const supabase = await clientGestion("messages");
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  const traite = donnees.get("traite") === "true";
  if (!id) return;

  await supabase.from("messages").update({ traite: !traite }).eq("id", id);
  revalidatePath("/admin/messages");
}

/* ------------------------------------------------------------ Événements */

const schemaEvenement = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Identifiant trop court.")
    .regex(/^[a-z0-9-]+$/, "Uniquement des minuscules, chiffres et tirets."),
  titre: z.string().trim().min(5, "Titre obligatoire."),
  chapo: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  etablissement: z.string().trim().max(150).optional().or(z.literal("")),
  lieu: z.string().trim().max(150).optional().or(z.literal("")),
  ville: z.string().trim().max(80).optional().or(z.literal("")),
  debut_le: z.string().min(1, "Date de début obligatoire."),
  fin_le: z.string().optional().or(z.literal("")),
  capacite: z.string().optional().or(z.literal("")),
  image_url: z.string().trim().url().optional().or(z.literal("")),
  publie: z.string().optional(),
});

export async function enregistrerEvenement(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaEvenement.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await clientGestion("evenements");
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const v = analyse.data;
  const { error } = await supabase.from("evenements").upsert(
    {
      slug: v.slug,
      titre: v.titre,
      chapo: v.chapo || null,
      description: v.description || null,
      etablissement: v.etablissement || null,
      lieu: v.lieu || null,
      ville: v.ville || null,
      debut_le: new Date(v.debut_le).toISOString(),
      fin_le: v.fin_le ? new Date(v.fin_le).toISOString() : null,
      capacite: v.capacite ? Number(v.capacite) : null,
      image_url: v.image_url || null,
      publie: v.publie === "on",
    },
    { onConflict: "slug" },
  );

  if (error) return { statut: "erreur", message: `Enregistrement impossible : ${error.message}` };

  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
  return { statut: "succes", message: "Événement enregistré." };
}

export async function basculerPublicationEvenement(donnees: FormData): Promise<void> {
  const supabase = await clientGestion("evenements");
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  const publie = donnees.get("publie") === "true";
  if (!id) return;

  await supabase.from("evenements").update({ publie: !publie }).eq("id", id);
  revalidatePath("/admin/evenements");
  revalidatePath("/evenements");
}

/* -------------------------------------------------------------- Articles */

const schemaArticle = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Identifiant trop court.")
    .regex(/^[a-z0-9-]+$/, "Uniquement des minuscules, chiffres et tirets."),
  titre: z.string().trim().min(5, "Titre obligatoire."),
  chapo: z.string().trim().max(300).optional().or(z.literal("")),
  contenu: z.string().trim().min(30, "Le contenu doit faire au moins 30 caractères."),
  categorie: z.string().trim().min(2, "Catégorie obligatoire."),
  auteur: z.string().trim().max(120).optional().or(z.literal("")),
  couverture_url: z.string().trim().url().optional().or(z.literal("")),
  publie: z.string().optional(),
});

export async function enregistrerArticle(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaArticle.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await clientGestion("articles");
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const v = analyse.data;
  const publie = v.publie === "on";

  const { error } = await supabase.from("articles").upsert(
    {
      slug: v.slug,
      titre: v.titre,
      chapo: v.chapo || null,
      contenu: v.contenu,
      categorie: v.categorie,
      auteur: v.auteur || null,
      couverture_url: v.couverture_url || null,
      publie,
      publie_le: publie ? new Date().toISOString() : null,
    },
    { onConflict: "slug" },
  );

  if (error) return { statut: "erreur", message: `Enregistrement impossible : ${error.message}` };

  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
  return { statut: "succes", message: "Article enregistré." };
}

export async function basculerPublicationArticle(donnees: FormData): Promise<void> {
  const supabase = await clientGestion("articles");
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  const publie = donnees.get("publie") === "true";
  if (!id) return;

  await supabase
    .from("articles")
    .update({ publie: !publie, publie_le: !publie ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath("/admin/articles");
  revalidatePath("/actualites");
}

/* ------------------------------------------------------------- Membres */

export async function enregistrerCotisation(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const schema = z.object({
    profil_id: z.uuid(),
    nature: z.enum(["adhesion", "mensuelle", "exceptionnelle", "don"]),
    periode: z.string().trim().max(20).optional().or(z.literal("")),
    montant: z.coerce.number().int().min(0, "Montant invalide."),
    statut: z.enum(["a_payer", "payee", "en_retard"]),
  });

  const analyse = schema.safeParse(Object.fromEntries(donnees));
  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await clientGestion("membres");
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const { error } = await supabase.from("cotisations").insert({
    ...analyse.data,
    periode: analyse.data.periode || null,
    paye_le: analyse.data.statut === "payee" ? new Date().toISOString().slice(0, 10) : null,
  });

  if (error) return { statut: "erreur", message: `Enregistrement impossible : ${error.message}` };

  revalidatePath("/admin/membres");
  return { statut: "succes", message: "Cotisation enregistrée." };
}

/* ---------------------------------------------------------------- Rôles */

const schemaRole = z.object({
  profil_id: z.uuid(),
  role: z.enum(ROLES_ATTRIBUABLES),
});

/**
 * Attribue un rôle de gestion à un membre.
 *
 * Trois garde-fous, dans cet ordre : seul un administrateur peut appeler
 * l'action ; personne ne modifie son propre rôle, faute de quoi une erreur
 * de manipulation coûterait l'accès ; et l'ONG ne peut pas se retrouver sans
 * administrateur. Le déclencheur `proteger_role_profil` rejouerait le
 * deuxième contrôle en base, celui-ci sert à rendre le refus explicite.
 */
export async function changerRole(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaRole.safeParse(Object.fromEntries(donnees));
  if (!analyse.success) {
    return { statut: "erreur", message: "Rôle ou membre invalide." };
  }

  const supabase = await clientGestion("roles");
  if (!supabase) {
    return { statut: "erreur", message: "Seul un administrateur peut distribuer les rôles." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === analyse.data.profil_id) {
    return {
      statut: "erreur",
      message:
        "Vous ne pouvez pas modifier votre propre rôle. Demandez-le à un autre administrateur.",
    };
  }

  if (analyse.data.role !== "admin") {
    const { count } = await supabase
      .from("profils")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")
      .eq("actif", true)
      .neq("id", analyse.data.profil_id);

    if ((count ?? 0) === 0) {
      return {
        statut: "erreur",
        message:
          "Retrait impossible : ce compte est le dernier administrateur actif. Nommez-en un autre d'abord.",
      };
    }
  }

  const { error } = await supabase
    .from("profils")
    .update({ role: analyse.data.role })
    .eq("id", analyse.data.profil_id);

  if (error) {
    return { statut: "erreur", message: `Changement refusé : ${error.message}` };
  }

  revalidatePath("/admin/roles");
  revalidatePath("/admin/membres");
  return { statut: "succes", message: `Rôle mis à jour : ${ROLES[analyse.data.role].nom}.` };
}

/* --------------------------------------------------------------- Galerie */

const schemaMedia = z.object({
  id: z.string().optional().or(z.literal("")),
  titre: z.string().trim().min(3, "Titre obligatoire."),
  legende: z.string().trim().max(300).optional().or(z.literal("")),
  url: z.string().trim().url("Ajoutez une photo avant d'enregistrer."),
  lieu: z.string().trim().max(150).optional().or(z.literal("")),
  prise_le: z.string().optional().or(z.literal("")),
  evenement_id: z.string().optional().or(z.literal("")),
  publie: z.string().optional(),
});

export async function enregistrerMedia(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaMedia.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await clientGestion("galerie");
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const v = analyse.data;
  const valeurs = {
    titre: v.titre,
    legende: v.legende || null,
    url: v.url,
    lieu: v.lieu || null,
    prise_le: v.prise_le || null,
    evenement_id: v.evenement_id || null,
    publie: v.publie === "on",
  };

  // Un identifiant présent signifie une modification, pas un ajout.
  const { error } = v.id
    ? await supabase.from("medias").update(valeurs).eq("id", v.id)
    : await supabase.from("medias").insert(valeurs);

  if (error) return { statut: "erreur", message: `Enregistrement impossible : ${error.message}` };

  revalidatePath("/admin/galerie");
  revalidatePath("/galerie");
  return {
    statut: "succes",
    message: v.id ? "Photo mise à jour." : "Photo ajoutée à la galerie.",
  };
}

export async function basculerPublicationMedia(donnees: FormData): Promise<void> {
  const supabase = await clientGestion("galerie");
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  const publie = donnees.get("publie") === "true";
  if (!id) return;

  await supabase.from("medias").update({ publie: !publie }).eq("id", id);
  revalidatePath("/admin/galerie");
  revalidatePath("/galerie");
}

export async function retirerMedia(donnees: FormData): Promise<void> {
  const supabase = await clientGestion("galerie");
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  if (!id) return;

  // La ligne part ; le fichier reste dans le bucket, volontairement : une
  // suppression accidentelle de photo ne doit pas être irréversible.
  await supabase.from("medias").delete().eq("id", id);
  revalidatePath("/admin/galerie");
  revalidatePath("/galerie");
}

/* -------------------------------------------------------- Contenus du site */

export async function enregistrerContenus(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const supabase = await clientGestion("contenus");
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const lignes: Array<{ cle: string; valeur: string | null; image_url: string | null; maj_le: string; maj_par: string | null }> = [];

  for (const champ of CHAMPS_CONTENU) {
    const brut = String(donnees.get(champ.cle) ?? "").trim();
    lignes.push({
      cle: champ.cle,
      valeur: champ.type === "image" ? null : brut || null,
      image_url: champ.type === "image" ? brut || null : null,
      maj_le: new Date().toISOString(),
      maj_par: user?.id ?? null,
    });
  }

  const { error } = await supabase.from("contenus_site").upsert(lignes, { onConflict: "cle" });
  if (error) return { statut: "erreur", message: `Enregistrement impossible : ${error.message}` };

  // Le contenu nourrit plusieurs routes publiques : on les revalide toutes.
  revalidatePath("/", "layout");
  return { statut: "succes", message: "Contenus du site mis à jour." };
}
