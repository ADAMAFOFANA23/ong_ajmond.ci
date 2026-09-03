"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, ExternalLink, GraduationCap } from "lucide-react";

import { cn } from "@/components/ui/primitives";

export type CartePartenaire = {
  cle: string;
  nom: string;
  ville?: string | null;
  logoUrl?: string | null;
  siteUrl?: string | null;
};

/**
 * Carrousel de partenaires.
 *
 * Le défilement est natif — points d'ancrage CSS, `overflow-x` — plutôt que
 * piloté par du JavaScript : le doigt, le trackpad, la molette horizontale et
 * la tabulation fonctionnent sans qu'on ait rien à écrire, et le contenu reste
 * atteignable si le script ne charge pas. Les flèches ne sont qu'un raccourci,
 * et elles s'éteignent aux extrémités plutôt que de boucler — sur une liste
 * finie de partenaires, revenir au début sans prévenir désoriente.
 *
 * Pas de défilement automatique : un carrousel qui bouge seul vole la lecture
 * et se bat avec `prefers-reduced-motion`.
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
  const piste = useRef<HTMLUListElement>(null);
  const animation = useRef<number | null>(null);
  const [versGauche, setVersGauche] = useState(false);
  const [versDroite, setVersDroite] = useState(false);

  const mesurer = useCallback(() => {
    const element = piste.current;
    if (!element) return;

    const reste = element.scrollWidth - element.clientWidth - element.scrollLeft;
    setVersGauche(element.scrollLeft > 4);
    setVersDroite(reste > 4);
  }, []);

  useEffect(() => {
    mesurer();
    const element = piste.current;
    if (!element) return;

    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);

    return () => {
      observateur.disconnect();
      if (animation.current !== null) cancelAnimationFrame(animation.current);
    };
  }, [mesurer]);

  /**
   * Défilement animé maison.
   *
   * `scrollTo({ behavior: "smooth" })` n'est pas honoré partout — certains
   * moteurs l'ignorent quand des points d'ancrage sont actifs, et le carrousel
   * paraît alors figé. Une animation explicite se comporte pareil partout,
   * respecte `prefers-reduced-motion`, et suit la même sortie exponentielle
   * que le reste du site.
   */
  function animerVers(element: HTMLElement, cible: number) {
    if (animation.current !== null) cancelAnimationFrame(animation.current);

    const depart = element.scrollLeft;
    const distance = cible - depart;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
     * Un onglet masqué ne reçoit aucune image d'animation : l'animation ne
     * démarrerait jamais et le défilement n'aurait tout simplement pas lieu.
     * Dans ce cas, comme sous mouvement réduit, on se place directement.
     */
    if (reduit || document.hidden || Math.abs(distance) < 2) {
      element.scrollLeft = cible;
      mesurer();
      return;
    }

    const duree = 420;
    const debut = performance.now();

    const avancer = (maintenant: number) => {
      const t = Math.min(1, (maintenant - debut) / duree);
      element.scrollLeft = depart + distance * (1 - Math.pow(1 - t, 3));

      if (t < 1) {
        animation.current = requestAnimationFrame(avancer);
      } else {
        animation.current = null;
        // L'événement `scroll` n'est pas garanti après un déplacement
        // programmé : on rafraîchit l'état des flèches nous-mêmes.
        mesurer();
      }
    };

    animation.current = requestAnimationFrame(avancer);
  }

  function glisser(direction: -1 | 1) {
    const element = piste.current;
    if (!element) return;

    /*
     * Le pas doit tomber exactement sur un point d'ancrage. Une distance
     * arbitraire — « 85 % de la largeur visible » — laisse l'animation fluide
     * s'arrêter entre deux cartes, et le moteur d'ancrage la ramène alors à sa
     * position de départ : le carrousel semble ne pas répondre.
     *
     * L'écart entre les deux premières cartes donne la largeur d'une carte,
     * gouttière comprise, sans avoir à connaître les classes utilitaires.
     */
    const cartes = element.children;
    const premiere = cartes[0] as HTMLElement | undefined;
    const seconde = cartes[1] as HTMLElement | undefined;
    if (!premiere) return;

    const pas = seconde ? seconde.offsetLeft - premiere.offsetLeft : premiere.offsetWidth;
    const parPage = Math.max(1, Math.floor(element.clientWidth / pas));

    const maximum = element.scrollWidth - element.clientWidth;
    const cible = element.scrollLeft + direction * pas * parPage;
    animerVers(element, Math.min(maximum, Math.max(0, cible)));
  }

  const Icone = icone === "etablissement" ? GraduationCap : Building2;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-craie-300 pb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-bleu-800/60">
          {titre}
        </h3>

        <div className="flex items-center gap-2">
          <span className="chiffres text-xs text-bleu-800/50">
            {partenaires.length} partenaire{partenaires.length > 1 ? "s" : ""}
          </span>

          <button
            type="button"
            onClick={() => glisser(-1)}
            disabled={!versGauche}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              versGauche
                ? "border-craie-300 bg-white text-bleu-800 hover:border-bleu-400 hover:text-bleu-900"
                : "cursor-not-allowed border-craie-200 text-bleu-800/25",
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="sr-only">Partenaires précédents</span>
          </button>

          <button
            type="button"
            onClick={() => glisser(1)}
            disabled={!versDroite}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
              versDroite
                ? "border-craie-300 bg-white text-bleu-800 hover:border-bleu-400 hover:text-bleu-900"
                : "cursor-not-allowed border-craie-200 text-bleu-800/25",
            )}
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
            <span className="sr-only">Partenaires suivants</span>
          </button>
        </div>
      </div>

      <ul
        ref={piste}
        onScroll={mesurer}
        tabIndex={0}
        aria-label={titre}
        className="piste-defilante mt-6 flex gap-4 overflow-x-auto pb-2"
      >
        {partenaires.map((partenaire) => {
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
                  <Icone
                    className="h-8 w-8 text-bleu-800/25"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                )}
              </span>

              <span className="mt-4 block text-[15px] font-medium leading-snug text-bleu-900">
                {partenaire.nom}
              </span>

              <span className="mt-auto flex items-end justify-between gap-2 pt-3">
                <span className="text-xs text-bleu-800/55">{partenaire.ville ?? ""}</span>
                {partenaire.siteUrl && (
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 text-brique-500"
                    aria-hidden
                  />
                )}
              </span>
            </>
          );

          return (
            <li key={partenaire.cle} className="w-[15.5rem] shrink-0 sm:w-[17rem]">
              {partenaire.siteUrl ? (
                <a
                  href={partenaire.siteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-full flex-col rounded-2xl border border-craie-300 bg-white p-5 transition-colors hover:border-bleu-300"
                >
                  {contenu}
                </a>
              ) : (
                <span className="flex h-full flex-col rounded-2xl border border-craie-300 bg-white p-5">
                  {contenu}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
