import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { Carrousel } from "@/components/sections/carrousel";
import { Vignette } from "@/components/ui/vignette";
import { formaterDateCourte } from "@/lib/format";
import type { EntreeFil } from "@/lib/donnees";

/**
 * Fil d'actualités et d'événements.
 *
 * Une seule piste pour les deux : un visiteur ne se demande pas s'il lit une
 * actualité ou un événement, il regarde ce que l'ONG fait en ce moment. La
 * distinction reste lisible sur chaque carte, elle ne structure pas la
 * section.
 *
 * La dérive est plus lente que celle des partenaires : ici on lit des titres,
 * pas des logos. Elle s'arrête à l'approche, comme partout ailleurs.
 */
export function FilActualite({ entrees }: { entrees: EntreeFil[] }) {
  const elements = entrees.map((entree) => ({
    cle: entree.cle,
    contenu: (
      <Link
        href={entree.href}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] transition duration-300 ease-out hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07]"
      >
        <Vignette
          graine={entree.graine}
          src={entree.imageUrl}
          className="aspect-[16/10] w-full shrink-0"
        />

        <span className="flex flex-1 flex-col p-5">
          <span className="flex items-center gap-2">
            <span
              className={
                entree.aVenir
                  ? "rounded-full bg-brique-500 px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  : "rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-bleu-100/80"
              }
            >
              {entree.aVenir
                ? "À venir"
                : entree.type === "evenement"
                  ? "Événement"
                  : "Actualité"}
            </span>
            <span className="chiffres text-[11px] text-bleu-100/55">
              {formaterDateCourte(entree.date)}
            </span>
          </span>

          <span className="mt-3 block font-display text-lg font-semibold leading-snug text-white">
            {entree.titre}
          </span>

          {entree.chapo && (
            <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-bleu-100/70">
              {entree.chapo}
            </span>
          )}

          <span className="mt-auto flex items-center justify-between gap-3 pt-4">
            {entree.lieu ? (
              <span className="flex min-w-0 items-center gap-1.5 text-xs text-bleu-100/55">
                {entree.type === "evenement" ? (
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                ) : (
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                )}
                <span className="truncate">{entree.lieu}</span>
              </span>
            ) : (
              <span />
            )}

            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-brique-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </span>
      </Link>
    ),
  }));

  return (
    <Carrousel
      titre="Actualités et événements"
      legende={`${entrees.length} publication${entrees.length > 1 ? "s" : ""}`}
      elements={elements}
      ton="sombre"
      vitesse={14}
      largeurCarte="w-[17rem] sm:w-[19rem]"
    />
  );
}
