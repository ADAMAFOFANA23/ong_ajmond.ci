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

/** Vitesse de dérive, en pixels par seconde. Lent : on doit pouvoir lire. */
const VITESSE = 22;

/** Délai avant reprise après une interaction manuelle. */
const REPRISE = 2500;

/**
 * Carrousel de partenaires, en dérive continue.
 *
 * Le défilement automatique est un mouvement constant, jamais une avance par
 * à-coups : un carrousel qui saute d'une page à l'autre vole la lecture en
 * cours et donne l'impression d'avoir raté quelque chose. La dérive, elle, se
 * regarde ou s'ignore.
 *
 * Elle s'interrompt dès que quelqu'un s'en approche — survol, focus clavier,
 * doigt, flèches — et ne reprend qu'après un temps mort. Elle ne démarre pas du
 * tout sous `prefers-reduced-motion`, ni dans un onglet masqué.
 *
 * Le défilement reste natif : doigt, trackpad, molette horizontale et
 * tabulation fonctionnent sans code, et les cartes restent atteignables si le
 * script ne charge pas.
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
  const derniereImage = useRef(0);
  const repriseDifferee = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [boucle, setBoucle] = useState(false);
  const [enPause, setEnPause] = useState(false);
  const [versGauche, setVersGauche] = useState(false);
  const [versDroite, setVersDroite] = useState(false);

  /** Largeur d'un tour complet, mesurée sur la première carte dupliquée. */
  const mesurerTour = useCallback(() => {
    const element = piste.current;
    if (!element) return 0;

    const premier = element.children[0] as HTMLElement | undefined;
    const copie = element.children[partenaires.length] as HTMLElement | undefined;
    if (!premier || !copie) return 0;

    return copie.offsetLeft - premier.offsetLeft;
  }, [partenaires.length]);

  const mesurer = useCallback(() => {
    const element = piste.current;
    if (!element) return;

    const deborde = element.scrollWidth > element.clientWidth + 4;
    const enroule = deborde && partenaires.length > 2;
    setBoucle(enroule);

    if (enroule) {
      // En boucle, on peut toujours aller des deux côtés : les flèches restent
      // actives et les deux voiles allumés.
      setVersGauche(true);
      setVersDroite(true);
      return;
    }

    const reste = element.scrollWidth - element.clientWidth - element.scrollLeft;
    setVersGauche(element.scrollLeft > 4);
    setVersDroite(reste > 4);
  }, [partenaires.length]);

  useEffect(() => {
    mesurer();
    const element = piste.current;
    if (!element) return;

    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);

    return () => {
      observateur.disconnect();
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      if (repriseDifferee.current) clearTimeout(repriseDifferee.current);
    };
  }, [mesurer]);

  /* ------------------------------------------------------ Dérive continue */

  useEffect(() => {
    const element = piste.current;
    if (!element || !boucle || enPause) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Un onglet masqué ne reçoit aucune image d'animation : inutile de
    // programmer quoi que ce soit, `visibilitychange` relancera au retour.
    if (document.hidden) return;

    const tour = mesurerTour();
    if (tour <= 0) return;

    derniereImage.current = 0;

    const avancer = (maintenant: number) => {
      if (derniereImage.current === 0) derniereImage.current = maintenant;

      const ecoule = (maintenant - derniereImage.current) / 1000;
      derniereImage.current = maintenant;

      let position = element.scrollLeft + VITESSE * ecoule;

      // Le contenu étant dupliqué, reculer d'un tour exact est invisible :
      // aucune carte ne change de place à l'écran.
      if (position >= tour) position -= tour;
      element.scrollLeft = position;

      animation.current = requestAnimationFrame(avancer);
    };

    animation.current = requestAnimationFrame(avancer);

    return () => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      animation.current = null;
    };
  }, [boucle, enPause, mesurerTour]);

  /** Une page masquée suspend la dérive ; le retour la relance. */
  useEffect(() => {
    const suivre = () => setEnPause(document.hidden);
    document.addEventListener("visibilitychange", suivre);
    return () => document.removeEventListener("visibilitychange", suivre);
  }, []);

  const suspendre = useCallback(() => {
    if (repriseDifferee.current) clearTimeout(repriseDifferee.current);
    setEnPause(true);
  }, []);

  const reprendreApresDelai = useCallback(() => {
    if (repriseDifferee.current) clearTimeout(repriseDifferee.current);
    repriseDifferee.current = setTimeout(() => setEnPause(false), REPRISE);
  }, []);

  /* ---------------------------------------------------------- Flèches */

  /**
   * Déplacement animé des flèches.
   *
   * `scrollTo({ behavior: "smooth" })` n'est pas honoré partout — certains
   * moteurs l'ignorent quand des points d'ancrage sont actifs. Une animation
   * explicite se comporte pareil partout, et se place directement là où aucune
   * image d'animation n'arrivera.
   */
  function animerVers(element: HTMLElement, cible: number) {
    if (animation.current !== null) cancelAnimationFrame(animation.current);

    const depart = element.scrollLeft;
    const distance = cible - depart;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduit || document.hidden || Math.abs(distance) < 2) {
      element.scrollLeft = cible;
      mesurer();
      return;
    }

    const duree = 420;
    const debut = performance.now();

    const avancer = (maintenant: number) => {
      const t = Math.min(1, (maintenant - debut) / duree);
      // Sortie exponentielle : départ franc, arrivée qui se pose.
      const progression = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      element.scrollLeft = depart + distance * progression;

      if (t < 1) {
        animation.current = requestAnimationFrame(avancer);
      } else {
        animation.current = null;
        mesurer();
      }
    };

    animation.current = requestAnimationFrame(avancer);
  }

  function glisser(direction: -1 | 1) {
    const element = piste.current;
    if (!element) return;

    const cartes = element.children;
    const premiere = cartes[0] as HTMLElement | undefined;
    const seconde = cartes[1] as HTMLElement | undefined;
    if (!premiere) return;

    const pas = seconde ? seconde.offsetLeft - premiere.offsetLeft : premiere.offsetWidth;
    const parPage = Math.max(1, Math.floor(element.clientWidth / pas));

    const tour = mesurerTour();
    let cible = element.scrollLeft + direction * pas * parPage;

    if (boucle && tour > 0) {
      // En boucle on enroule au lieu de buter contre une extrémité.
      if (cible < 0) cible += tour;
      if (cible >= tour) cible -= tour;
    } else {
      cible = Math.min(element.scrollWidth - element.clientWidth, Math.max(0, cible));
    }

    suspendre();
    animerVers(element, cible);
    reprendreApresDelai();
  }

  const Icone = icone === "etablissement" ? GraduationCap : Building2;

  /*
   * Le contenu est doublé pour que l'enroulement ne se voie pas. La copie est
   * masquée aux technologies d'assistance et retirée du parcours clavier :
   * elle ne dit rien de nouveau.
   */
  const cartes = boucle
    ? [
        ...partenaires.map((p) => ({ ...p, copie: false })),
        ...partenaires.map((p) => ({ ...p, copie: true })),
      ]
    : partenaires.map((p) => ({ ...p, copie: false }));

  const classeCarte =
    "flex h-full flex-col rounded-2xl border border-craie-300 bg-white p-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-bleu-300 hover:shadow-[0_14px_34px_-16px_rgba(17,26,48,0.45)]";

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

      <div className="relative mt-6">
        <span
          aria-hidden
          className="voile-piste voile-piste-gauche"
          data-visible={versGauche ? "oui" : "non"}
        />
        <span
          aria-hidden
          className="voile-piste voile-piste-droite"
          data-visible={versDroite ? "oui" : "non"}
        />

        <ul
          ref={piste}
          tabIndex={0}
          aria-label={titre}
          data-boucle={boucle ? "oui" : "non"}
          onScroll={boucle ? undefined : mesurer}
          onMouseEnter={suspendre}
          onMouseLeave={reprendreApresDelai}
          onFocusCapture={suspendre}
          onBlurCapture={reprendreApresDelai}
          onPointerDown={suspendre}
          onPointerUp={reprendreApresDelai}
          onTouchStart={suspendre}
          onTouchEnd={reprendreApresDelai}
          className="piste-defilante flex gap-4 overflow-x-auto pb-2"
        >
          {cartes.map((partenaire, rang) => {
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

            return (
              <li
                key={`${partenaire.cle}-${rang}`}
                aria-hidden={partenaire.copie || undefined}
                className="w-[15.5rem] shrink-0 sm:w-[17rem]"
              >
                {partenaire.siteUrl ? (
                  <a
                    href={partenaire.siteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    tabIndex={partenaire.copie ? -1 : undefined}
                    className={classeCarte}
                  >
                    {contenu}
                  </a>
                ) : (
                  <span className={classeCarte}>{contenu}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
