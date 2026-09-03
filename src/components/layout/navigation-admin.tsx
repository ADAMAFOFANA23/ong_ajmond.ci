"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Images,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { cn } from "@/components/ui/primitives";
import type { Section } from "@/lib/roles";

const LIENS = [
  { href: "/admin", label: "Tableau de bord", icone: LayoutDashboard, section: "tableau-de-bord" },
  { href: "/admin/adhesions", label: "Adhésions", icone: UserPlus, section: "adhesions" },
  { href: "/admin/membres", label: "Membres", icone: Users, section: "membres" },
  { href: "/admin/evenements", label: "Événements", icone: CalendarDays, section: "evenements" },
  { href: "/admin/inscriptions", label: "Inscriptions", icone: ClipboardList, section: "inscriptions" },
  { href: "/admin/articles", label: "Actualités", icone: Newspaper, section: "articles" },
  { href: "/admin/galerie", label: "Galerie", icone: Images, section: "galerie" },
  { href: "/admin/contenus", label: "Contenus du site", icone: FileText, section: "contenus" },
  { href: "/admin/messages", label: "Messages", icone: MessageSquare, section: "messages" },
  { href: "/admin/roles", label: "Rôles", icone: ShieldCheck, section: "roles" },
] as const satisfies readonly { href: string; label: string; icone: unknown; section: Section }[];

/**
 * Rail de navigation de l'administration.
 *
 * Vertical dans la barre latérale sombre à partir de `lg`, horizontal et
 * défilant en dessous — la même liste, jamais dupliquée dans le balisage.
 *
 * `compteurs` n'affiche que ce qui appelle une action : une pastille signale un
 * reste à traiter, pas un total.
 */
export function NavigationAdmin({
  sections,
  compteurs = {},
  orientation = "verticale",
}: {
  /** Sections ouvertes au rôle courant. Le reste n'est pas affiché. */
  sections: readonly Section[];
  compteurs?: Partial<Record<string, number>>;
  orientation?: "verticale" | "horizontale";
}) {
  const chemin = usePathname();
  const verticale = orientation === "verticale";
  const liens = LIENS.filter((lien) => sections.includes(lien.section));

  return (
    <nav aria-label="Navigation de l'administration">
      <ul
        className={cn(
          verticale ? "space-y-1" : "-mx-1 flex gap-1 overflow-x-auto pb-1",
        )}
      >
        {liens.map((lien) => {
          const actif =
            lien.href === "/admin" ? chemin === "/admin" : chemin.startsWith(lien.href);
          const aTraiter = compteurs[lien.section] ?? 0;
          const Icone = lien.icone;

          return (
            <li key={lien.href}>
              <Link
                href={lien.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  verticale ? "w-full" : "whitespace-nowrap",
                  actif
                    ? "bg-white/10 text-white"
                    : "text-bleu-100/65 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icone
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    actif ? "text-brique-400" : "text-bleu-100/45 group-hover:text-bleu-100/80",
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="flex-1">{lien.label}</span>
                {aTraiter > 0 && (
                  <span className="chiffres inline-flex min-w-[1.5rem] justify-center rounded-full bg-brique-500 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {aTraiter}
                    <span className="sr-only"> à traiter</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
