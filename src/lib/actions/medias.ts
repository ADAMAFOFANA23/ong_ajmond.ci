"use server";

import { creerClientServeur } from "@/lib/supabase/server";

const TYPES_ACCEPTES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAILLE_MAX = 5 * 1024 * 1024;

export type ResultatTeleversement = { url?: string; erreur?: string };

/**
 * Dépose une image dans le bucket public « medias » et renvoie son URL.
 *
 * L'autorisation n'est pas revérifiée ici : le téléversement passe par la
 * session de l'utilisateur, donc les politiques de `storage.objects` la
 * tranchent — seuls les rôles `admin` et `communication` peuvent écrire. Ce
 * qui est contrôlé ici, c'est ce qu'on accepte de stocker.
 */
export async function televerserImage(donnees: FormData): Promise<ResultatTeleversement> {
  const fichier = donnees.get("fichier");
  const dossier = String(donnees.get("dossier") ?? "divers").replace(/[^a-z0-9-]/gi, "");

  if (!(fichier instanceof File) || fichier.size === 0) {
    return { erreur: "Aucun fichier reçu." };
  }

  if (!TYPES_ACCEPTES.includes(fichier.type)) {
    return { erreur: "Format non accepté. Utilisez du JPEG, PNG, WebP ou AVIF." };
  }

  if (fichier.size > TAILLE_MAX) {
    const mo = (fichier.size / (1024 * 1024)).toFixed(1);
    return { erreur: `Image trop lourde (${mo} Mo). La limite est de 5 Mo.` };
  }

  const supabase = await creerClientServeur();
  if (!supabase) return { erreur: "Base de données non configurée." };

  const extension = (fichier.name.split(".").pop() ?? "jpg").toLowerCase().slice(0, 5);
  const chemin = `${dossier || "divers"}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("medias")
    .upload(chemin, fichier, { contentType: fichier.type, upsert: false });

  if (error) {
    // Le refus le plus probable est un manque de droits : le dire clairement.
    return {
      erreur: error.message.toLowerCase().includes("row-level security")
        ? "Votre rôle ne permet pas d'ajouter des images."
        : `Téléversement impossible : ${error.message}`,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("medias").getPublicUrl(chemin);

  return { url: publicUrl };
}
