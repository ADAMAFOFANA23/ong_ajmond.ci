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
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAVIGATION.map((lien) => {
              const actif = chemin === lien.href || chemin.startsWith(`${lien.href}/`);
              return (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    aria-current={actif ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      actif ? "bg-bleu-50 text-bleu-700" : "text-bleu-800/75 hover:text-bleu-700",
                    )}
                  >
                    {lien.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={lienEspace}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-bleu-800/75 transition-colors hover:text-bleu-700"
          >
            <UserRound className="h-4 w-4" aria-hidden />
            {libelleEspace}
          </Link>
          {/* Un membre déjà connecté n'a rien à faire d'un appel à adhérer. */}
          {!connecte && (
            <Link
              href="/adhesion"
              className="inline-flex items-center rounded-full bg-brique-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brique-600"
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
              {NAVIGATION.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-bleu-900 hover:bg-bleu-50"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={lienEspace}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-bleu-900 hover:bg-bleu-50"
                >
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
