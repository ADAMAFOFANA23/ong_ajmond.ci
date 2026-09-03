import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- Section */

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function Conteneur({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
  );
}

/* ----------------------------------------------------------------- Titres */

export function Surtitre({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brique-600",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-brique-500" />
      {children}
    </p>
  );
}

export function TitreSection({
  children,
  className,
  niveau = 2,
}: {
  children: ReactNode;
  className?: string;
  niveau?: 1 | 2 | 3;
}) {
  const Balise = `h${niveau}` as const;
  return (
    <Balise
      className={cn(
        niveau === 1
          ? "text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          : "text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl",
        "text-bleu-900",
        className,
      )}
    >
      {children}
    </Balise>
  );
}

export function Chapo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-4 max-w-2xl text-base leading-relaxed text-bleu-800/80 sm:text-lg", className)}>
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- Boutons */

type VarianteBouton = "primaire" | "secondaire" | "fantome" | "accent";

const STYLES_BOUTON: Record<VarianteBouton, string> = {
  primaire: "bg-bleu-600 text-white hover:bg-bleu-700 focus-visible:outline-bleu-600",
  accent: "bg-brique-500 text-white hover:bg-brique-600 focus-visible:outline-brique-500",
  secondaire:
    "border border-bleu-200 bg-white text-bleu-700 hover:border-bleu-400 hover:bg-bleu-50 focus-visible:outline-bleu-600",
  fantome: "text-bleu-700 hover:bg-bleu-50 focus-visible:outline-bleu-600",
};

const BASE_BOUTON =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export function LienBouton({
  variante = "primaire",
  className,
  ...props
}: ComponentProps<typeof Link> & { variante?: VarianteBouton }) {
  return <Link {...props} className={cn(BASE_BOUTON, STYLES_BOUTON[variante], className)} />;
}

export function Bouton({
  variante = "primaire",
  className,
  ...props
}: ComponentProps<"button"> & { variante?: VarianteBouton }) {
  return <button {...props} className={cn(BASE_BOUTON, STYLES_BOUTON[variante], className)} />;
}

/* ----------------------------------------------------------------- Cartes */

export function Carte({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm transition hover:border-bleu-200 hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  ton = "bleu",
  className,
}: {
  children: ReactNode;
  ton?: "bleu" | "brique" | "neutre" | "vert";
  className?: string;
}) {
  const tons = {
    bleu: "bg-bleu-50 text-bleu-700 ring-bleu-200",
    brique: "bg-brique-50 text-brique-700 ring-brique-200",
    neutre: "bg-sable-100 text-bleu-800 ring-sable-200",
    vert: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tons[ton],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Message({
  ton,
  children,
}: {
  ton: "succes" | "erreur" | "info";
  children: ReactNode;
}) {
  const tons = {
    succes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    erreur: "border-brique-200 bg-brique-50 text-brique-800",
    info: "border-bleu-200 bg-bleu-50 text-bleu-800",
  } as const;

  return (
    <div role="status" className={cn("rounded-xl border px-4 py-3 text-sm", tons[ton])}>
      {children}
    </div>
  );
}

export function EtatVide({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="rounded-xl border border-dashed border-craie-300 bg-craie-50 px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-bleu-900">{titre}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-bleu-800/70">{texte}</p>
    </div>
  );
}
