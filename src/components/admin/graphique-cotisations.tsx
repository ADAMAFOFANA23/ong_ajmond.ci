import { formaterMontant } from "@/lib/format";

export type PointCotisation = { mois: string; libelle: string; total: number };

/**
 * Cotisations encaissées sur douze mois.
 *
 * Tracé à la main en SVG plutôt qu'avec une librairie : le graphique n'a qu'une
 * série, doit rester lisible à zéro donnée, et aucune dépendance ne se
 * justifiait pour cela. Aucune interactivité JavaScript — les repères portent
 * un `<title>` que le navigateur affiche au survol.
 */
export function GraphiqueCotisations({ points }: { points: PointCotisation[] }) {
  const maximum = Math.max(...points.map((p) => p.total), 0);

  if (maximum === 0) {
    return (
      <div className="flex h-full min-h-[16rem] flex-col items-center justify-center border border-dashed border-craie-300 px-6 py-12 text-center">
        <p className="font-display text-lg font-semibold text-bleu-900">
          Aucune cotisation encaissée
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-bleu-800/65">
          La courbe apparaîtra dès qu&apos;une cotisation sera marquée « payée ». Elles
          s&apos;enregistrent depuis la fiche d&apos;un membre.
        </p>
      </div>
    );
  }

  const largeur = 720;
  const hauteur = 240;
  const margeBas = 28;
  const margeHaut = 16;
  const utile = hauteur - margeBas - margeHaut;

  const pas = points.length > 1 ? largeur / (points.length - 1) : largeur;
  const coordonnees = points.map((point, index) => ({
    ...point,
    x: index * pas,
    y: margeHaut + utile - (point.total / maximum) * utile,
  }));

  const ligne = coordonnees.map((p) => `${p.x},${p.y}`).join(" ");
  const aire = `${coordonnees[0].x},${margeHaut + utile} ${ligne} ${
    coordonnees[coordonnees.length - 1].x
  },${margeHaut + utile}`;

  return (
    <figure className="flex h-full flex-col">
      <svg
        viewBox={`0 0 ${largeur} ${hauteur}`}
        className="h-auto w-full flex-1"
        role="img"
        aria-label={`Cotisations encaissées mois par mois, maximum ${formaterMontant(maximum)}`}
      >
        <defs>
          <linearGradient id="aire-cotisations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brique-500)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-brique-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((fraction) => (
          <line
            key={fraction}
            x1="0"
            x2={largeur}
            y1={margeHaut + utile * fraction}
            y2={margeHaut + utile * fraction}
            stroke="var(--color-craie-300)"
            strokeWidth="1"
          />
        ))}

        <polygon points={aire} fill="url(#aire-cotisations)" />
        <polyline
          points={ligne}
          fill="none"
          stroke="var(--color-brique-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coordonnees.map((point) => (
          <circle
            key={point.mois}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#ffffff"
            stroke="var(--color-brique-500)"
            strokeWidth="2"
          >
            <title>{`${point.libelle} — ${formaterMontant(point.total)}`}</title>
          </circle>
        ))}
      </svg>

      <figcaption className="chiffres mt-3 flex justify-between text-xs text-bleu-800/55">
        <span>{points[0]?.libelle}</span>
        <span>Maximum {formaterMontant(maximum)}</span>
        <span>{points[points.length - 1]?.libelle}</span>
      </figcaption>
    </figure>
  );
}
