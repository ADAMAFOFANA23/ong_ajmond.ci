"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/components/ui/primitives";

export type ElementCarrousel = { cle: string; contenu: ReactNode };

/** Délai avant reprise du mouvement après une interaction. */
const REPRISE = 2500;

/**
 * Piste défilante générique.
 *
 * Toute la mécanique vit ici — enroulement, mouvement, flèches, voiles de bord,
 * puces — pour que les carrousels du site partagent une seule grammaire. Deux
 * comportements différents sur une même page se remarquent immédiatement.
 *
 * Deux régimes de mouvement, jamais les deux à la fois :
 *
 * - la **dérive** continue, pour un rail de petites cartes qu'on balaie du
 *   regard sans les lire une à une ;
 * - l'**avance par pas**, pour des panneaux pleine largeur qu'on lit vraiment.
 *   Une dérive continue sur un titre de trois lignes le rendrait illisible.
 *
 * Le défilement reste natif : doigt, trackpad, molette horizontale et
 * tabulation fonctionnent sans code, et le contenu reste atteignable si le
 * script ne charge pas.
 */
export function Carrousel({
  titre,
  niveauTitre = 3,
  legende,
  elements,
  ton = "clair",
  derive = true,
  vitesse = 22,
  largeurCarte = "w-[15.5rem] sm:w-[17rem]",
  intervalle = 0,
  puces = false,
  actions,
  plein = false,
}: {
  titre: string;
  /**
   * Rang du titre dans le plan de la page. La plupart des carrousels vivent
   * sous un `h2` de section ; celui du hero suit directement le `h1`.
   */
  niveauTitre?: 2 | 3;
  /** Texte discret à droite du titre : un décompte, une période. */
  legende?: string;
  elements: ElementCarrousel[];
  /** `sombre` sur un aplat nuit : voiles et flèches s'inversent. */
  ton?: "clair" | "sombre";
  derive?: boolean;
  vitesse?: number;
  largeurCarte?: string;
  /** Millisecondes entre deux avances automatiques. Remplace la dérive. */
  intervalle?: number;
  puces?: boolean;
  /** Commandes propres à la section, posées à gauche des flèches. */
  actions?: ReactNode;
  /** Panneaux pleine largeur : ni voiles, ni mise en avant à l'approche. */
  plein?: boolean;
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
  const [indexActif, setIndexActif] = useState(0);

  /*
   * Écart horizontal entre deux cartes, en géométrie réelle.
   *
   * `offsetLeft` est arrondi au pixel entier alors qu'une carte peut mesurer
   * 1205,6 px : l'écart accumulait un demi-pixel par carte, et l'ancrage
   * dérivait de quelques pixels sur un tour complet. Les rectangles, eux, sont
   * fractionnaires, et leur différence ne dépend pas du défilement courant.
   */
  const ecartEntre = useCallback((element: HTMLElement, depuis: number, jusqu: number) => {
    const premier = element.children[depuis] as HTMLElement | undefined;
    const second = element.children[jusqu] as HTMLElement | undefined;
    if (!premier) return 0;
    if (!second) return premier.getBoundingClientRect().width;

    return second.getBoundingClientRect().left - premier.getBoundingClientRect().left;
  }, []);

  /** Distance d'une carte à la suivante, gouttière comprise. */
  const mesurerPas = useCallback(() => {
    const element = piste.current;
    return element ? ecartEntre(element, 0, 1) : 0;
  }, [ecartEntre]);

  /** Largeur d'un tour complet, mesurée sur la première carte dupliquée. */
  const mesurerTour = useCallback(() => {
    const element = piste.current;
    if (!element || !element.children[elements.length]) return 0;

    return ecartEntre(element, 0, elements.length);
  }, [ecartEntre, elements.length]);

  /** Rang de la carte en place, ramené au tour réel. */
  const majIndex = useCallback(() => {
    const element = piste.current;
    if (!element) return;

    const pas = mesurerPas();
    if (pas <= 0) return;

    const brut = Math.round(element.scrollLeft / pas);
    setIndexActif(((brut % elements.length) + elements.length) % elements.length);
  }, [elements.length, mesurerPas]);

  const mesurer = useCallback(() => {
    const element = piste.current;
    if (!element) return;

    const deborde = element.scrollWidth > element.clientWidth + 4;
    const enroule = deborde && elements.length > 2;
    setBoucle(enroule);
    majIndex();

    if (enroule) {
      // En boucle on peut toujours aller des deux côtés.
      setVersGauche(true);
      setVersDroite(true);
      return;
    }

    const reste = element.scrollWidth - element.clientWidth - element.scrollLeft;
    setVersGauche(element.scrollLeft > 4);
    setVersDroite(reste > 4);
  }, [elements.length, majIndex]);

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

    majIndex();

    const tour = mesurerTour();
    if (tour <= 0) return;

    const x = element.scrollLeft;
    if (x < tour * 0.5) element.scrollLeft = x + tour;
    else if (x > tour * 2.5) element.scrollLeft = x - tour;

    position.current = element.scrollLeft;
  }, [boucle, majIndex, mesurerTour]);

  /** Largeur du tour au moment du dernier recentrage. */
  const tourPose = useRef(0);

  /*
   * À l'entrée en boucle, on se place au début du tour central.
   *
   * Sans condition sur la position courante : au rechargement, le navigateur
   * restaure le défilement horizontal de la piste, et cette valeur ne veut plus
   * rien dire une fois le contenu triplé — elle laissait le carrousel arrêté au
   * milieu d'une carte.
   *
   * Le repère est la largeur du tour, pas un drapeau posé une fois : une mesure
   * prise avant que les polices et les images ne soient arrivées donne un tour
   * dérisoire, et le carrousel resterait calé sur cette valeur fausse. Tant
   * qu'elle change, on se replace.
   */
  useEffect(() => {
    const element = piste.current;
    if (!element || !boucle) {
      tourPose.current = 0;
      return;
    }

    const placer = () => {
      const tour = mesurerTour();
      if (tour <= 0 || Math.abs(tour - tourPose.current) < 2) return;

      element.scrollLeft = tour;
      position.current = tour;
      tourPose.current = tour;
    };

    placer();

    const observateur = new ResizeObserver(placer);
    observateur.observe(element);
    // La piste garde sa largeur quand ses cartes changent de hauteur ou de
    // gabarit : c'est la première carte qui porte l'information.
    const premiere = element.children[0];
    if (premiere) observateur.observe(premiere);

    return () => observateur.disconnect();
  }, [boucle, mesurerTour]);

  /* ------------------------------------------------------ Dérive continue */

  useEffect(() => {
    const element = piste.current;
    if (!element || !derive || intervalle > 0 || !boucle || enPause) return;
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
  }, [boucle, derive, enPause, intervalle, mesurerTour, vitesse]);

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

  /* ------------------------------------------------------- Déplacements */

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

    // L'horloge est celle de la première image : `performance.now()` lu ici
    // avancerait d'un cran avant même que rien n'ait bougé.
    let debut = 0;

    const avancer = (maintenant: number) => {
      if (debut === 0) debut = maintenant;

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

  /**
   * Avance d'une page.
   *
   * `auto` distingue le mouvement de fond du geste de l'utilisateur : lui seul
   * met le carrousel en pause, sans quoi l'avance automatique se suspendrait
   * elle-même à chaque tour.
   */
  function deplacer(direction: -1 | 1, auto = false) {
    const element = piste.current;
    if (!element) return;

    const pas = mesurerPas();
    if (pas <= 0) return;

    const parPage = Math.max(1, Math.floor(element.clientWidth / pas));

    let cible = element.scrollLeft + direction * pas * parPage;
    if (!boucle) {
      cible = Math.min(element.scrollWidth - element.clientWidth, Math.max(0, cible));
    }

    if (!auto) suspendre();
    animerVers(element, cible);
    if (!auto) reprendreApresDelai();
  }

  /** Rejoint une carte par son rang, par le chemin le plus court. */
  function allerA(rang: number) {
    const element = piste.current;
    if (!element) return;

    const pas = mesurerPas();
    if (pas <= 0) return;

    const absolu = Math.round(element.scrollLeft / pas);
    const courant = ((absolu % elements.length) + elements.length) % elements.length;

    let ecart = rang - courant;
    if (boucle) {
      // Le tour est circulaire : passer par la fin peut être plus court.
      if (ecart > elements.length / 2) ecart -= elements.length;
      if (ecart < -elements.length / 2) ecart += elements.length;
    }

    const vise = element.children[absolu + ecart] as HTMLElement | undefined;
    const origine = element.children[0] as HTMLElement | undefined;
    if (!vise || !origine) return;

    suspendre();
    animerVers(element, vise.offsetLeft - origine.offsetLeft);
    reprendreApresDelai();
  }

  /** Ramène la piste sur la carte la plus proche. */
  function aligner() {
    const element = piste.current;
    if (!element || animation.current !== null) return;

    const pas = mesurerPas();
    if (pas <= 0) return;

    const cible = Math.round(element.scrollLeft / pas) * pas;
    if (Math.abs(cible - element.scrollLeft) > 2) animerVers(element, cible);
  }

  /* -------------------------------------------------- Avance automatique */

  // Rafraîchies à chaque rendu : minuteur et écouteur appellent toujours la
  // version qui connaît l'état courant, sans avoir à se reconstruire.
  const avanceAuto = useRef<() => void>(() => {});
  const alignementAuto = useRef<() => void>(() => {});
  useEffect(() => {
    avanceAuto.current = () => deplacer(1, true);
    alignementAuto.current = aligner;
  });

  /*
   * Un panneau pleine largeur doit se poser sur une carte entière. L'ancrage
   * CSS ne peut pas s'en charger : en « mandatory » il contrarie les
   * déplacements programmés, et la boucle le désactive de toute façon. On
   * réaligne donc à la fin du geste, jamais pendant.
   */
  useEffect(() => {
    const element = piste.current;
    if (!element || !plein) return;

    const surFin = () => alignementAuto.current();
    element.addEventListener("scrollend", surFin);
    return () => element.removeEventListener("scrollend", surFin);
  }, [plein]);

  useEffect(() => {
    if (intervalle <= 0 || !boucle || enPause) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.hidden) return;

    const minuteur = setInterval(() => avanceAuto.current(), intervalle);
    return () => clearInterval(minuteur);
  }, [boucle, enPause, intervalle]);

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
  const Intitule = niveauTitre === 2 ? "h2" : "h3";

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
        <Intitule
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.14em]",
            sombre ? "text-bleu-100/60" : "text-bleu-800/60",
          )}
        >
          {titre}
        </Intitule>

        <div className="flex flex-wrap items-center gap-2">
          {actions}

          {legende && (
            <span
              className={cn("chiffres text-xs", sombre ? "text-bleu-100/50" : "text-bleu-800/50")}
            >
              {legende}
            </span>
          )}

          <button
            type="button"
            onClick={() => deplacer(-1)}
            disabled={!versGauche}
            className={classeFleche(versGauche)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="sr-only">{titre} — précédents</span>
          </button>

          <button
            type="button"
            onClick={() => deplacer(1)}
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
        {!plein && (
          <>
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
          </>
        )}

        <ul
          ref={piste}
          tabIndex={0}
          aria-label={titre}
          data-boucle={boucle ? "oui" : "non"}
          data-plein={plein ? "oui" : "non"}
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

      {puces && elements.length > 1 && (
        <div className="mt-6 flex items-center gap-2">
          {elements.map((element, rang) => (
            <button
              key={element.cle}
              type="button"
              onClick={() => allerA(rang)}
              aria-current={rang === indexActif || undefined}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                rang === indexActif
                  ? sombre
                    ? "w-8 bg-brique-500"
                    : "w-8 bg-bleu-800"
                  : sombre
                    ? "w-4 bg-white/25 hover:bg-white/50"
                    : "w-4 bg-bleu-800/20 hover:bg-bleu-800/40",
              )}
            >
              <span className="sr-only">
                {titre} — panneau {rang + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
