"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/components/ui/primitives";

export type ElementCarrousel = { cle: string; contenu: ReactNode };

/** Délai avant reprise de la dérive après une interaction. */
const REPRISE = 2500;

/**
 * Piste défilante générique.
 *
 * Toute la mécanique vit ici — enroulement, dérive, flèches, voiles de bord —
 * pour que les carrousels du site partagent une seule grammaire. Deux
 * comportements différents sur une même page se remarquent immédiatement.
 *
 * Le défilement reste natif : doigt, trackpad, molette horizontale et
 * tabulation fonctionnent sans code, et le contenu reste atteignable si le
 * script ne charge pas.
 */
export function Carrousel({
  titre,
  legende,
  elements,
  ton = "clair",
  derive = true,
  vitesse = 22,
  largeurCarte = "w-[15.5rem] sm:w-[17rem]",
}: {
  titre: string;
  /** Texte discret à droite du titre : un décompte, une période. */
  legende?: string;
  elements: ElementCarrousel[];
  /** `sombre` sur un aplat nuit : voiles et flèches s'inversent. */
  ton?: "clair" | "sombre";
  derive?: boolean;
  vitesse?: number;
  largeurCarte?: string;
}) {
  const piste = useRef<HTMLUListElement>(null);
  const animation = useRef<number | null>(null);
  const derniereImage = useRef(0);
  const repriseDifferee = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Position en flottant, tenue à part.
   *
   * `scrollLeft` est arrondi à l'entier par le navigateur. À vitesse lente, une
   * image ne fait avancer que d'une fraction de pixel : relire `scrollLeft`
   * puis y ajouter cette fraction redonne le même entier, et la dérive reste
   * sur place. On accumule donc soi-même et on n'écrit que le résultat.
   */
  const position = useRef(0);

  const [boucle, setBoucle] = useState(false);
  const [enPause, setEnPause] = useState(false);
  const [versGauche, setVersGauche] = useState(false);
  const [versDroite, setVersDroite] = useState(false);

  /** Largeur d'un tour complet, mesurée sur la première carte dupliquée. */
  const mesurerTour = useCallback(() => {
    const element = piste.current;
    if (!element) return 0;

    const premier = element.children[0] as HTMLElement | undefined;
    const copie = element.children[elements.length] as HTMLElement | undefined;
    if (!premier || !copie) return 0;

    return copie.offsetLeft - premier.offsetLeft;
  }, [elements.length]);

  const mesurer = useCallback(() => {
    const element = piste.current;
    if (!element) return;

    const deborde = element.scrollWidth > element.clientWidth + 4;
    const enroule = deborde && elements.length > 2;
    setBoucle(enroule);

    if (enroule) {
      // En boucle on peut toujours aller des deux côtés.
      setVersGauche(true);
      setVersDroite(true);
      return;
    }

    const reste = element.scrollWidth - element.clientWidth - element.scrollLeft;
    setVersGauche(element.scrollLeft > 4);
    setVersDroite(reste > 4);
  }, [elements.length]);

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

  /**
   * Ramène la position dans le tour du milieu.
   *
   * Le contenu est triplé : le tour central est encadré d'une copie de chaque
   * côté, donc glisser d'un tour entier ne change rien à l'écran. C'est ce qui
   * permet de tourner dans les deux sens sans buter sur une extrémité.
   */
  const recentrer = useCallback(() => {
    const element = piste.current;
    if (!element || !boucle) return;

    const tour = mesurerTour();
    if (tour <= 0) return;

    const x = element.scrollLeft;
    if (x < tour * 0.5) element.scrollLeft = x + tour;
    else if (x > tour * 2.5) element.scrollLeft = x - tour;

    position.current = element.scrollLeft;
  }, [boucle, mesurerTour]);

  /** À l'entrée en boucle, on se place au début du tour central. */
  useEffect(() => {
    const element = piste.current;
    if (!element || !boucle) return;

    const tour = mesurerTour();
    if (tour <= 0 || element.scrollLeft > 4) return;

    element.scrollLeft = tour;
    position.current = tour;
  }, [boucle, mesurerTour]);

  /* ------------------------------------------------------ Dérive continue */

  useEffect(() => {
    const element = piste.current;
    if (!element || !derive || !boucle || enPause) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Un onglet masqué ne reçoit aucune image d'animation : `visibilitychange`
    // relancera au retour plutôt que de tourner dans le vide.
    if (document.hidden) return;

    const tour = mesurerTour();
    if (tour <= 0) return;

    derniereImage.current = 0;
    position.current = element.scrollLeft;

    const avancer = (maintenant: number) => {
      if (derniereImage.current === 0) derniereImage.current = maintenant;

      const ecoule = (maintenant - derniereImage.current) / 1000;
      derniereImage.current = maintenant;

      position.current += vitesse * ecoule;
      if (position.current >= tour * 2) position.current -= tour;
      element.scrollLeft = position.current;

      animation.current = requestAnimationFrame(avancer);
    };

    animation.current = requestAnimationFrame(avancer);

    return () => {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      animation.current = null;
    };
  }, [boucle, derive, enPause, mesurerTour, vitesse]);

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

  function animerVers(element: HTMLElement, cible: number) {
    if (animation.current !== null) cancelAnimationFrame(animation.current);

    const depart = element.scrollLeft;
    const distance = cible - depart;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduit || document.hidden || Math.abs(distance) < 2) {
      element.scrollLeft = cible;
      mesurer();
      recentrer();
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
        recentrer();
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

    let cible = element.scrollLeft + direction * pas * parPage;
    if (!boucle) {
      cible = Math.min(element.scrollWidth - element.clientWidth, Math.max(0, cible));
    }

    suspendre();
    animerVers(element, cible);
    reprendreApresDelai();
  }

  /*
   * Contenu triplé pour que l'enroulement ne se voie pas. Les copies sont
   * masquées aux technologies d'assistance et retirées du parcours clavier :
   * elles ne disent rien de nouveau.
   */
  const cartes = boucle
    ? [
        ...elements.map((e) => ({ ...e, copie: true })),
        ...elements.map((e) => ({ ...e, copie: false })),
        ...elements.map((e) => ({ ...e, copie: true })),
      ]
    : elements.map((e) => ({ ...e, copie: false }));

  const sombre = ton === "sombre";

  const classeFleche = (actif: boolean) =>
    cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
      actif
        ? sombre
          ? "border-white/25 text-white/80 hover:border-white/60 hover:text-white"
          : "border-craie-300 bg-white text-bleu-800 hover:border-bleu-400 hover:text-bleu-900"
        : sombre
          ? "cursor-not-allowed border-white/10 text-white/20"
          : "cursor-not-allowed border-craie-200 text-bleu-800/25",
    );

  return (
    <section>
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 border-b pb-4",
          sombre ? "border-white/15" : "border-craie-300",
        )}
      >
        <h3
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.14em]",
            sombre ? "text-bleu-100/60" : "text-bleu-800/60",
          )}
        >
          {titre}
        </h3>

        <div className="flex items-center gap-2">
          {legende && (
            <span
              className={cn("chiffres text-xs", sombre ? "text-bleu-100/50" : "text-bleu-800/50")}
            >
              {legende}
            </span>
          )}

          <button
            type="button"
            onClick={() => glisser(-1)}
            disabled={!versGauche}
            className={classeFleche(versGauche)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="sr-only">{titre} — précédents</span>
          </button>

          <button
            type="button"
            onClick={() => glisser(1)}
            disabled={!versDroite}
            className={classeFleche(versDroite)}
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
            <span className="sr-only">{titre} — suivants</span>
          </button>
        </div>
      </div>

      <div
        className="relative mt-6"
        style={
          {
            "--voile-fond": sombre ? "var(--color-bleu-950)" : "var(--color-craie-100)",
          } as CSSProperties
        }
      >
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
          onScroll={boucle ? recentrer : mesurer}
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
          {cartes.map((carte, rang) => (
            <li
              key={`${carte.cle}-${rang}`}
              aria-hidden={carte.copie || undefined}
              // Une copie ne doit pas être atteignable au clavier.
              inert={carte.copie || undefined}
              className={cn("shrink-0", largeurCarte)}
            >
              {carte.contenu}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
