import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { Carrousel } from "@/components/sections/carrousel";
import { Vignette } from "@/components/ui/vignette";
import { formaterDate } from "@/lib/format";
import type { EntreeFil } from "@/lib/donnees";

/**
 * Panneau d'ouverture : le fil d'actualités et d'événements en pleine largeur.
 *
 * Le hero ne présente plus l'ONG en général, il montre ce qu'elle fait
 * maintenant. Une page qui affiche la même phrase toute l'année ne donne aucune
 * raison de revenir ; un fil qui s'ouvre sur la prochaine intervention, si.
 *
 * Un panneau à la fois, et l'avance se fait par pas : on lit ces titres, on ne
 * les balaie pas comme les logos des partenaires. Elle s'arrête dès qu'on
 * survole, qu'on tabule ou qu'on pose le doigt — et ne reprend qu'après.
 */
export function FilHero({ entrees, actions }: { entrees: EntreeFil[]; actions?: React.ReactNode }) {
  const elements = entrees.map((entree) => ({
    cle: entree.cle,
    contenu: (
      <article className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                entree.aVenir
                  ? "rounded-full bg-brique-500 px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-bleu-100/80"
              }
            >
              {entree.aVenir
                ? "À venir"
                : entree.type === "evenement"
                  ? "Événement"
                  : "Actualité"}
            </span>
            <span className="chiffres text-sm text-bleu-100/60">{formaterDate(entree.date)}</span>
          </div>

          {/*
            Titre de panneau et non titre de document : la hiérarchie de la page
            est portée par le h1 et par l'intitulé du carrousel.
          */}
          <p className="mt-5 font-display text-[clamp(1.85rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
            {entree.titre}
          </p>

          {entree.chapo && (
            <p className="mt-5 line-clamp-3 max-w-[54ch] text-lg leading-relaxed text-bleu-100/80">
              {entree.chapo}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={entree.href}
              className="group inline-flex items-center gap-2 rounded-full bg-brique-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brique-600"
            >
              {entree.type === "evenement" ? "Voir l'événement" : "Lire l'article"}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>

            {entree.lieu && (
              <span className="flex min-w-0 items-center gap-2 text-sm text-bleu-100/60">
                {entree.type === "evenement" ? (
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
                )}
                <span className="truncate">{entree.lieu}</span>
              </span>
            )}
          </div>
        </div>

        {/*
          Le cadre découpe ce que le zoom lent déborde : sans lui, le visuel
          grandirait par-dessus la colonne de texte.
        */}
        <div className="overflow-hidden rounded-2xl">
          <Vignette
            graine={entree.graine}
            src={entree.imageUrl}
            className="zoom-lent aspect-[16/10] w-full"
          />
        </div>
      </article>
    ),
  }));

  return (
    <Carrousel
      titre="Actualités et événements"
      niveauTitre={2}
      elements={elements}
      ton="sombre"
      plein
      derive={false}
      intervalle={7000}
      puces
      actions={actions}
      largeurCarte="w-full"
    />
  );
}
