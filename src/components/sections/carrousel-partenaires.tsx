import Image from "next/image";
import { Building2, ExternalLink, GraduationCap } from "lucide-react";

import { Carrousel } from "@/components/sections/carrousel";

export type CartePartenaire = {
  cle: string;
  nom: string;
  ville?: string | null;
  logoUrl?: string | null;
  siteUrl?: string | null;
};

const CLASSE_CARTE =
  "flex h-full flex-col rounded-2xl border border-craie-300 bg-white p-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-bleu-300 hover:shadow-[0_14px_34px_-16px_rgba(17,26,48,0.45)]";

/**
 * Rail de partenaires.
 *
 * Toute la mécanique — enroulement, dérive, flèches, voiles de bord — vient de
 * `Carrousel` ; il ne reste ici que la carte elle-même.
 */
export function CarrouselPartenaires({
  titre,
  partenaires,
  icone = "etablissement",
}: {
  titre: string;
  partenaires: CartePartenaire[];
  icone?: "etablissement" | "institution";
}) {
  const Icone = icone === "etablissement" ? GraduationCap : Building2;

  const elements = partenaires.map((partenaire) => {
    const contenu = (
      <>
        <span className="flex h-16 items-center">
          {partenaire.logoUrl ? (
            <span className="relative h-14 w-full">
              <Image
                src={partenaire.logoUrl}
                alt=""
                fill
                sizes="200px"
                className="object-contain object-left"
              />
            </span>
          ) : (
            <Icone className="h-8 w-8 text-bleu-800/25" strokeWidth={1.25} aria-hidden />
          )}
        </span>

        <span className="mt-4 block text-[15px] font-medium leading-snug text-bleu-900">
          {partenaire.nom}
        </span>

        <span className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-xs text-bleu-800/55">{partenaire.ville ?? ""}</span>
          {partenaire.siteUrl && (
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-brique-500" aria-hidden />
          )}
        </span>
      </>
    );

    return {
      cle: partenaire.cle,
      contenu: partenaire.siteUrl ? (
        <a
          href={partenaire.siteUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={CLASSE_CARTE}
        >
          {contenu}
        </a>
      ) : (
        <span className={CLASSE_CARTE}>{contenu}</span>
      ),
    };
  });

  return (
    <Carrousel
      titre={titre}
      legende={`${partenaires.length} partenaire${partenaires.length > 1 ? "s" : ""}`}
      elements={elements}
    />
  );
}
