"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { creerClientServeur } from "@/lib/supabase/server";
import { MESSAGE_SUPABASE_ABSENT, type EtatFormulaire } from "./etat";

const texte = (min: number, max: number, champ: string) =>
  z
    .string()
    .trim()
    .min(min, `${champ} : ${min} caractères minimum.`)
    .max(max, `${champ} : ${max} caractères maximum.`);

/* ------------------------------------------------------- Demande d'adhésion */

const schemaAdhesion = z.object({
  nom: texte(2, 80, "Nom"),
  prenoms: texte(2, 120, "Prénoms"),
  email: z.email("Adresse e-mail invalide.").trim(),
  telephone: texte(8, 30, "Téléphone"),
  profession: z.string().trim().max(120).optional().or(z.literal("")),
  ville: z.string().trim().max(80).optional().or(z.literal("")),
  type_membre: z.enum(["actif", "honneur", "bienfaiteur"]),
  motivation: texte(20, 1500, "Motivation"),
  engagement: z.literal("on", { message: "Vous devez accepter les statuts de l'ONG." }),
});

export async function envoyerDemandeAdhesion(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaAdhesion.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const valeurs = analyse.data;
  const { error } = await supabase.from("demandes_adhesion").insert({
    nom: valeurs.nom,
    prenoms: valeurs.prenoms,
    email: valeurs.email,
    telephone: valeurs.telephone,
    type_membre: valeurs.type_membre,
    motivation: valeurs.motivation,
    profession: valeurs.profession || null,
    ville: valeurs.ville || null,
  });

  if (error) {
    return { statut: "erreur", message: `Envoi impossible : ${error.message}` };
  }

  revalidatePath("/admin/adhesions");
  return {
    statut: "succes",
    message:
      "Votre demande d'adhésion a bien été enregistrée. Le Bureau Exécutif vous recontactera pour constituer votre dossier.",
  };
}

/* ------------------------------------------------------------ Contact */

const schemaContact = z.object({
  nom: texte(2, 120, "Nom"),
  email: z.email("Adresse e-mail invalide.").trim(),
  telephone: z.string().trim().max(30).optional().or(z.literal("")),
  sujet: texte(3, 150, "Sujet"),
  message: texte(15, 3000, "Message"),
});

export async function envoyerMessage(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaContact.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const { error } = await supabase.from("messages").insert({
    ...analyse.data,
    telephone: analyse.data.telephone || null,
  });

  if (error) return { statut: "erreur", message: `Envoi impossible : ${error.message}` };

  revalidatePath("/admin/messages");
  return { statut: "succes", message: "Message envoyé. Nous vous répondons dans les meilleurs délais." };
}

/* -------------------------------------------------- Inscription événement */

const schemaInscription = z.object({
  evenement_id: z.uuid(),
  slug: z.string(),
  nom: texte(2, 80, "Nom"),
  prenoms: texte(2, 120, "Prénoms"),
  email: z.email("Adresse e-mail invalide.").trim(),
  telephone: z.string().trim().max(30).optional().or(z.literal("")),
  qualite: z.enum(["eleve", "encadreur", "parent", "partenaire", "autre"]),
  etablissement: z.string().trim().max(150).optional().or(z.literal("")),
});

export async function sInscrireEvenement(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaInscription.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Merci de corriger les champs signalés.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { slug, ...valeurs } = analyse.data;
  const { error } = await supabase.from("inscriptions").insert({
    ...valeurs,
    telephone: valeurs.telephone || null,
    etablissement: valeurs.etablissement || null,
    profil_id: user?.id ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { statut: "erreur", message: "Cette adresse e-mail est déjà inscrite à cet événement." };
    }
    return { statut: "erreur", message: `Inscription impossible : ${error.message}` };
  }

  revalidatePath(`/evenements/${slug}`);
  return {
    statut: "succes",
    message: "Inscription enregistrée. Vous recevrez une confirmation avant l'événement.",
  };
}

