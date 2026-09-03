"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, UserRound } from "lucide-react";

import { NAVIGATION } from "@/content/organisation";
import { Logo } from "./logo";
import { cn } from "@/components/ui/primitives";

export function Entete({ connecte, admin }: { connecte: boolean; admin: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();

  // Referme le menu lors d'un changement de route, sans effet secondaire :
  // ajustement d'état pendant le rendu (cf. « You Might Not Need an Effect »).
  const [cheminAffiche, setCheminAffiche] = useState(chemin);
  if (chemin !== cheminAffiche) {
    setCheminAffiche(chemin);
    setOuvert(false);
  }

  const lienEspace = admin ? "/admin" : connecte ? "/espace-membre" : "/connexion";
  const libelleEspace = admin ? "Administration" : connecte ? "Mon espace" : "Se connecter";

  return (
    <header className="sticky top-0 z-50 border-b border-bleu-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo courant={chemin === "/"} />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAVIGATION.map((lien) => {
              const actif = chemin === lien.href || chemin.startsWith(`${lien.href}/`);
              return (
                /*
                  L'élément occupe toute la hauteur de l'en-tête : le trait
                  s'aligne alors sur sa bordure basse sans décalage arbitraire,
                  et suivra une éventuelle modification de cette hauteur.
                */
                <li key={lien.href} className="relative flex h-20 items-center">
                  <Link
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap px-3 py-2 text-sm transition-colors",
                      actif
                        ? "font-semibold text-bleu-900"
                        : "font-medium text-bleu-800/75 hover:text-bleu-900",
                    )}
                  >
                    {lien.label}
                  </Link>

                  {/*
                    Repère de page courante : un trait au ras de la bordure de
                    l'en-tête, dans le rouge de signal. Il dit « vous êtes ici »
                    d'un coup d'œil, là où la pastille pâle héritée de
                    l'ancienne charte se confondait avec un simple survol.
                  */}
                  {actif && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-brique-500"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={lienEspace}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-bleu-800/75 transition-colors hover:text-bleu-700"
          >
            <UserRound className="h-4 w-4 shrink-0" aria-hidden />
            {libelleEspace}
          </Link>
          {/* Un membre déjà connecté n'a rien à faire d'un appel à adhérer. */}
          {!connecte && (
            <Link
              href="/adhesion"
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-brique-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brique-600"
            >
              Adhérer
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOuvert((v) => !v)}
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-bleu-200 text-bleu-700 lg:hidden"
        >
          <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
          {ouvert ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {ouvert && (
        <div id="menu-mobile" className="border-t border-bleu-100 bg-white lg:hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col gap-1">
              {NAVIGATION.map((lien) => {
                const actif = chemin === lien.href || chemin.startsWith(`${lien.href}/`);
                return (
                  <li key={lien.href}>
                    <Link
                      href={lien.href}
                      aria-current={actif ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-4 py-3 text-base text-bleu-900 transition-colors",
                        actif ? "bg-craie-100 font-semibold" : "font-medium hover:bg-craie-50",
                      )}
                    >
                      {/* Même repère qu'en grand écran, ramené à un point. */}
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          actif ? "bg-brique-500" : "bg-transparent",
                        )}
                      />
                      {lien.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href={lienEspace}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-bleu-900 transition-colors hover:bg-craie-50"
                >
                  {/* Pastille vide : elle ne marque rien, elle aligne. */}
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0" />
                  {libelleEspace}
                </Link>
              </li>
            </ul>
            {!connecte && (
              <Link
                href="/adhesion"
                className="mt-4 flex items-center justify-center rounded-full bg-brique-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Adhérer à l&apos;ONG
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
