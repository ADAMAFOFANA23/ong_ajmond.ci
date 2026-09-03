import Image from "next/image";
import { Camera } from "lucide-react";

import { cn } from "@/components/ui/primitives";

/**
 * Emplacement photographique.
 *
 * L'ONG ne dispose d'aucune photographie au moment de la refonte, et il est
 * hors de question d'en fabriquer : ce composant matérialise donc chaque image
 * attendue — ratio exact, dimensions annoncées, cadre hachuré. Il est
 * délibérément visible comme un manque.
 *
 * Dès qu'une source est fournie, il devient l'image, sans autre changement
 * dans les pages appelantes.
 */
export function CadrePhoto({
  sujet,
  largeur,
  hauteur,
  src,
  alt,
  className,
  ton = "clair",
  priority,
}: {
  /** Ce que la photo doit montrer, à destination de qui la fournira. */
  sujet: string;
  largeur: number;
  hauteur: number;
  src?: string;
  alt?: string;
  className?: string;
  /** `sombre` sur un aplat bleu, `clair` sur fond ivoire. */
  ton?: "clair" | "sombre";
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt ?? sujet}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const tons =
    ton === "sombre"
      ? "border-white/20 text-white/45"
      : "border-bleu-300 text-bleu-800/45";

  return (
    <div
      role="img"
      aria-label={`Emplacement photographique à fournir : ${sujet}`}
      className={cn(
        "hachure flex flex-col items-center justify-center gap-3 border border-dashed px-6 py-10 text-center",
        tons,
        className,
      )}
    >
      <Camera className="h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden />
      <p className="max-w-xs text-sm leading-snug">{sujet}</p>
      <p className="chiffres text-xs tabular-nums opacity-80">
        {largeur} × {hauteur} px
      </p>
    </div>
  );
}
