"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { creerClientServeur } from "@/lib/supabase/server";
import { MESSAGE_SUPABASE_ABSENT, type EtatFormulaire } from "./etat";

async function clientAdmin() {
  const supabase = await creerClientServeur();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profils").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") return null;

  return supabase;
}

/* ---------------------------------------------------- Demandes d'adhésion */

export async function changerStatutDemande(donnees: FormData): Promise<void> {
  const supabase = await clientAdmin();
  if (!supabase) return;

  const id = String(donnees.get("id") ?? "");
  const statut = String(donnees.get("statut") ?? "");
  if (!id || !["nouvelle", "en_cours", "acceptee", "refusee"].includes(statut)) return;

  await supabase.from("demandes_adhesion").update({ statut }).eq("id", id);
  revalidatePath("/admin/adhesions");
}

/* ------------------------------------------------------------- Messages */

export async function basculerTraitementMessage(donnees: FormData): Promise<void> {
  const supabase = await clientAdmin();
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

  const supabase = await clientAdmin();
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
  const supabase = await clientAdmin();
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

  const supabase = await clientAdmin();
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
  const supabase = await clientAdmin();
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

  const supabase = await clientAdmin();
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
