import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Bell, LogOut, Mail, Search, Settings } from "lucide-react";

import { NavigationAdmin } from "@/components/layout/navigation-admin";
import { cn } from "@/components/ui/primitives";
import { ORGANISATION } from "@/content/organisation";
import { seDeconnecter } from "@/lib/actions/auth";
import { ROLES, sectionsDe } from "@/lib/roles";
import { creerClientServeur, profilGestionnaire } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

/** Restes à traiter, affichés en pastille sur le rail et dans la cloche. */
async function compteursATraiter() {
  const supabase = await creerClientServeur();
  if (!supabase) return { adhesions: 0, messages: 0 };

  const [demandes, messages] = await Promise.all([
    supabase
      .from("demandes_adhesion")
      .select("*", { count: "exact", head: true })
      .eq("statut", "nouvelle"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("traite", false),
  ]);

  return { adhesions: demandes.count ?? 0, messages: messages.count ?? 0 };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profil = await profilGestionnaire();
  if (!profil) redirect("/connexion?suite=/admin");

  const sections = sectionsDe(profil.role);
  const roleCourant = ROLES[profil.role];
  const compteurs = await compteursATraiter();

  /*
   * Un profil créé depuis le tableau de bord Supabase n'a ni nom ni prénoms :
   * la ligne resterait vide. L'e-mail prend alors la place du nom.
   */
  const identite = [profil.prenoms, profil.nom].filter(Boolean).join(" ").trim();
  const initiales =
    (profil.prenoms?.[0] ?? profil.email[0] ?? "?").toUpperCase() +
    (profil.nom?.[0]?.toUpperCase() ?? "");

  const aujourdhui = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Abidjan",
  }).format(new Date());

  return (
    <div className="flex min-h-screen flex-col bg-craie-100 lg:flex-row">
      {/* ------------------------------------------------- Rail (desktop) */}
      <aside className="sur-sombre hidden bg-bleu-950 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex items-center gap-3 px-5 py-6">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brique-500 font-display text-sm font-bold text-white"
          >
            AJ
          </span>
          <Link href="/" className="min-w-0">
            <span className="block truncate font-display text-base font-semibold text-white">
              {ORGANISATION.sigle}
            </span>
            <span className="block text-xs text-bleu-100/50">Administration</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <NavigationAdmin sections={sections} compteurs={compteurs} />
        </div>

        {/* Pied du rail, comme dans la référence : réglages puis sortie. */}
        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/espace-membre"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-bleu-100/65 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
            Mon profil
          </Link>

          <form action={seDeconnecter}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-bleu-100/65 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
              Déconnexion
            </button>
          </form>

          <div className="mt-3 border-t border-white/10 px-3 pt-3">
            {identite && <p className="truncate text-sm font-medium text-white">{identite}</p>}
            <p
              className={cn(
                "truncate text-xs",
                identite ? "mt-0.5 text-bleu-100/50" : "text-sm font-medium text-white",
              )}
            >
              {profil.email}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-brique-400">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brique-500" />
              {roleCourant.nom}
            </p>
          </div>
        </div>
      </aside>

      {/* --------------------------------------------------------- Contenu */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-craie-300 bg-craie-50/95 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            {/* Recherche réelle : elle mène à une page de résultats. */}
            <form action="/admin/recherche" className="relative min-w-0 flex-1 sm:max-w-md">
              <label htmlFor="recherche-admin" className="sr-only">
                Rechercher un membre, une demande, un événement ou un article
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-bleu-800/40"
                aria-hidden
              />
              <input
                id="recherche-admin"
                name="q"
                type="search"
                placeholder="Rechercher un membre, un événement…"
                className="h-10 w-full rounded-full border border-craie-300 bg-white pl-10 pr-4 text-sm text-bleu-900 outline-none transition placeholder:text-bleu-800/40 focus:border-bleu-400"
              />
            </form>

            <p className="chiffres hidden rounded-full border border-craie-300 bg-white px-4 py-2 text-xs text-bleu-800/70 first-letter:uppercase xl:block">
              {aujourdhui}
            </p>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/admin/messages"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-craie-300 bg-white text-bleu-800/70 transition-colors hover:text-bleu-900"
              >
                <Mail className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                {compteurs.messages > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brique-500 ring-2 ring-white" />
                )}
                <span className="sr-only">
                  Messages{compteurs.messages > 0 ? ` — ${compteurs.messages} à traiter` : ""}
                </span>
              </Link>

              <Link
                href="/admin/adhesions"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-craie-300 bg-white text-bleu-800/70 transition-colors hover:text-bleu-900"
              >
                <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                {compteurs.adhesions > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brique-500 ring-2 ring-white" />
                )}
                <span className="sr-only">
                  Demandes d&apos;adhésion
                  {compteurs.adhesions > 0 ? ` — ${compteurs.adhesions} nouvelles` : ""}
                </span>
              </Link>

              <span className="hidden items-center gap-2.5 rounded-full border border-craie-300 bg-white py-1.5 pl-4 pr-1.5 sm:flex">
                <span className="max-w-[12rem] truncate text-sm font-medium text-bleu-900">
                  {identite || profil.email}
                </span>
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brique-500 text-xs font-semibold text-white"
                >
                  {initiales}
                </span>
              </span>

              <Link
                href="/"
                className="hidden items-center gap-1.5 text-sm font-medium text-bleu-800/70 transition-colors hover:text-bleu-900 xl:inline-flex"
              >
                Voir le site
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Le même rail, horizontal, quand la barre latérale est masquée. */}
          <div className="sur-sombre bg-bleu-950 px-4 py-2 sm:px-6 lg:hidden">
            <NavigationAdmin
              sections={sections}
              compteurs={compteurs}
              orientation="horizontale"
            />
          </div>
        </header>

        <main id="contenu" className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="border-t border-craie-300 px-4 py-5 text-xs text-bleu-800/50 sm:px-6 lg:px-8">
          <form action={seDeconnecter} className="lg:hidden">
            <button type="submit" className="font-semibold text-brique-600">
              Déconnexion
            </button>
          </form>
          <p className="mt-2 lg:mt-0">
            Espace réservé au Bureau Exécutif — {ORGANISATION.sigle}
          </p>
        </footer>
      </div>
    </div>
  );
}
