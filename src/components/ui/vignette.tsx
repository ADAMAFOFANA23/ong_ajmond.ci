import Image from "next/image";

import { cn } from "@/components/ui/primitives";

/**
 * Visuel d'un événement ou d'un programme.
 *
 * L'ONG n'a pas encore de photothèque, et chaque action doit malgré tout
 * porter un élément visuel. Plutôt qu'une image générique répétée — ou pire,
 * une photo inventée — chaque entrée reçoit une composition dessinée à partir
 * de son identifiant : même slug, même visuel, toujours.
 *
 * Le motif reprend la courbe du logo : des arcs concentriques traversés d'une
 * bande hachurée. Quatre harmonies et trois compositions, soit douze visuels
 * distincts, tous dans la palette de l'ONG.
 *
 * Dès qu'une vraie image est renseignée (`evenements.image_url`), elle prend
 * la place sans autre changement.
 */

const HARMONIES = [
  { fond: "#111a30", trait: "#ed2024", voile: "#3c58a7" },
  { fond: "#1b2949", trait: "#f16f70", voile: "#8ea6df" },
  { fond: "#243564", trait: "#ed2024", voile: "#eaddc6" },
  { fond: "#7a1719", trait: "#eaddc6", voile: "#f16f70" },
] as const;

/** Hachage stable : le même slug doit produire le même visuel à chaque rendu. */
function empreinte(graine: string): number {
  let valeur = 2166136261;
  for (let i = 0; i < graine.length; i += 1) {
    valeur ^= graine.charCodeAt(i);
    valeur = Math.imul(valeur, 16777619);
  }
  return Math.abs(valeur);
}

export function Vignette({
  graine,
  src,
  alt,
  className,
  legende,
}: {
  /** Identifiant stable de l'entrée : son slug. */
  graine: string;
  src?: string | null;
  alt?: string;
  className?: string;
  /** Texte court incrusté, par exemple le lieu ou l'édition. */
  legende?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-bleu-950", className)}>
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const cle = empreinte(graine);
  const harmonie = HARMONIES[cle % HARMONIES.length];
  const composition = cle % 3;
  const decalage = (cle >> 3) % 40;
  const rotation = (cle >> 5) % 90;
  const identifiant = `vignette-${cle.toString(36)}`;

  // Trois centres possibles pour les arcs, d'où trois cadrages très différents.
  const centre = [
    { x: 30, y: 110 },
    { x: 130, y: 20 },
    { x: 82, y: 62 },
  ][composition];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <svg
        viewBox="0 0 160 120"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <pattern
            id={`${identifiant}-hachure`}
            width="7"
            height="7"
            patternTransform={`rotate(${rotation})`}
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="7" stroke={harmonie.voile} strokeWidth="1.2" />
          </pattern>
          <clipPath id={`${identifiant}-cadre`}>
            <rect width="160" height="120" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${identifiant}-cadre)`}>
          <rect width="160" height="120" fill={harmonie.fond} />

          {/* Bande hachurée : l'écho du grain du papier institutionnel. */}
          <rect
            x={-40 + decalage}
            y="-40"
            width="70"
            height="200"
            fill={`url(#${identifiant}-hachure)`}
            opacity="0.35"
            transform={`rotate(${18 + (cle % 12)} 80 60)`}
          />

          {/* Arcs concentriques, repris de la courbe du logo. */}
          {[26, 42, 58, 74].map((rayon, index) => (
            <circle
              key={rayon}
              cx={centre.x + decalage / 3}
              cy={centre.y}
              r={rayon}
              fill="none"
              stroke={index === 1 ? harmonie.trait : harmonie.voile}
              strokeWidth={index === 1 ? 2.2 : 1}
              opacity={index === 1 ? 0.95 : 0.4}
            />
          ))}

          <circle cx={centre.x + decalage / 3} cy={centre.y} r="7" fill={harmonie.trait} />
        </g>
      </svg>

      {legende && (
        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-xs font-medium text-white">
          {legende}
        </p>
      )}
    </div>
  );
}
