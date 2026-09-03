"use client";

import Image from "next/image";
import { useId, useRef, useState, useTransition } from "react";
import { ImageUp, Loader2, Trash2 } from "lucide-react";

import { televerserImage } from "@/lib/actions/medias";
import { cn } from "@/components/ui/primitives";

/**
 * Champ de téléversement d'image.
 *
 * Le fichier part dès sa sélection plutôt qu'à la soumission : sur une
 * connexion lente, savoir tout de suite que l'image est passée vaut mieux que
 * de découvrir un échec après avoir rempli tout le formulaire. Le champ ne
 * transporte ensuite que l'URL, dans un input caché — le formulaire parent n'a
 * rien à savoir du stockage.
 */
export function ChampImage({
  nom,
  label,
  dossier,
  valeurInitiale,
  aide,
  className,
}: {
  /** Nom de l'input caché qui portera l'URL. */
  nom: string;
  label: string;
  /** Sous-dossier du bucket : « evenements », « articles », « galerie »… */
  dossier: string;
  valeurInitiale?: string | null;
  aide?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(valeurInitiale ?? "");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const champFichier = useRef<HTMLInputElement>(null);
  const identifiant = useId();

  function choisir(fichier: File | undefined) {
    if (!fichier) return;
    setErreur(null);

    const donnees = new FormData();
    donnees.set("fichier", fichier);
    donnees.set("dossier", dossier);

    demarrer(async () => {
      const resultat = await televerserImage(donnees);
      if (resultat.erreur) setErreur(resultat.erreur);
      else if (resultat.url) setUrl(resultat.url);
    });
  }

  return (
    <div className={className}>
      <span className="mb-1.5 block text-sm font-medium text-bleu-900">{label}</span>
      <input type="hidden" name={nom} value={url} />

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border",
            url ? "border-craie-300" : "hachure border-dashed border-craie-300 text-bleu-800/30",
          )}
        >
          {url ? (
            <Image src={url} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center">
              <ImageUp className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            </span>
          )}

          {enCours && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/75">
              <Loader2 className="h-5 w-5 animate-spin text-bleu-700" aria-hidden />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={champFichier}
            id={identifiant}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(evenement) => choisir(evenement.target.files?.[0])}
            className="block w-full text-sm text-bleu-800/75 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-bleu-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-bleu-800"
          />

          <p className="mt-2 text-xs leading-snug text-bleu-800/60">
            {aide ?? "JPEG, PNG, WebP ou AVIF. 5 Mo maximum."}
          </p>

          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl("");
                if (champFichier.current) champFichier.current.value = "";
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brique-600 hover:text-brique-700"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Retirer l&apos;image
            </button>
          )}

          {erreur && (
            <p role="alert" className="mt-2 text-xs font-medium text-brique-700">
              {erreur}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
