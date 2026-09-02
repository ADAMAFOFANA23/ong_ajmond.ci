"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { creerClientServeur } from "@/lib/supabase/server";
import { MESSAGE_SUPABASE_ABSENT, type EtatFormulaire } from "./etat";

const schemaConnexion = z.object({
  email: z.email("Adresse e-mail invalide.").trim(),
  motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  suite: z.string().optional(),
});

export async function seConnecter(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaConnexion.safeParse(Object.fromEntries(donnees));

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Identifiants incomplets.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { statut: "erreur", message: MESSAGE_SUPABASE_ABSENT };

  const { error } = await supabase.auth.signInWithPassword({
    email: analyse.data.email,
    password: analyse.data.motDePasse,
  });

  if (error) {
    return { statut: "erreur", message: "E-mail ou mot de passe incorrect." };
  }

  revalidatePath("/", "layout");
  redirect(analyse.data.suite || "/espace-membre");
}

const schemaInscription = z
  .object({
    nom: z.string().trim().min(2, "Nom obligatoire."),
    prenoms: z.string().trim().min(2, "Prénoms obligatoires."),
    telephone: z.string().trim().min(8, "Téléphone obligatoire."),
    email: z.email("Adresse e-mail invalide.").trim(),
    motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmation: z.string(),
  })
  .refine((v) => v.motDePasse === v.confirmation, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmation"],
  });

export async function creerCompte(
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

  const { error } = await supabase.auth.signUp({
    email: analyse.data.email,
    password: analyse.data.motDePasse,
    options: {
      data: {
        nom: analyse.data.nom,
        prenoms: analyse.data.prenoms,
        telephone: analyse.data.telephone,
      },
    },
  });

  if (error) {
    return { statut: "erreur", message: `Création impossible : ${error.message}` };
  }

  return {
    statut: "succes",
    message:
      "Compte créé. Si la confirmation par e-mail est activée sur le projet Supabase, vérifiez votre boîte de réception avant de vous connecter.",
  };
}

export async function seDeconnecter() {
  const supabase = await creerClientServeur();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

const schemaProfil = z.object({
  nom: z.string().trim().min(2, "Nom obligatoire."),
  prenoms: z.string().trim().min(2, "Prénoms obligatoires."),
  telephone: z.string().trim().max(30).optional().or(z.literal("")),
  profession: z.string().trim().max(120).optional().or(z.literal("")),
  ville: z.string().trim().max(80).optional().or(z.literal("")),
});

export async function mettreAJourProfil(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const analyse = schemaProfil.safeParse(Object.fromEntries(donnees));

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
  if (!user) return { statut: "erreur", message: "Session expirée, reconnectez-vous." };

  const { error } = await supabase
    .from("profils")
    .update({
      nom: analyse.data.nom,
      prenoms: analyse.data.prenoms,
      telephone: analyse.data.telephone || null,
      profession: analyse.data.profession || null,
      ville: analyse.data.ville || null,
    })
    .eq("id", user.id);

  if (error) return { statut: "erreur", message: `Mise à jour impossible : ${error.message}` };

  revalidatePath("/espace-membre");
  return { statut: "succes", message: "Profil mis à jour." };
}
