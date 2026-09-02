"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/components/ui/primitives";

const LIENS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/adhesions", label: "Adhésions" },
  { href: "/admin/membres", label: "Membres" },
  { href: "/admin/evenements", label: "Événements" },
  { href: "/admin/inscriptions", label: "Inscriptions" },
  { href: "/admin/articles", label: "Actualités" },
  { href: "/admin/messages", label: "Messages" },
];

export function NavigationAdmin() {
  const chemin = usePathname();

  return (
    <nav aria-label="Navigation de l'administration">
      <ul className="-mx-1 flex gap-1 overflow-x-auto pb-1">
        {LIENS.map((lien) => {
          const actif = chemin === lien.href;
          return (
            <li key={lien.href}>
              <Link
                href={lien.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  actif
                    ? "bg-bleu-600 text-white"
                    : "text-bleu-800/70 hover:bg-bleu-50 hover:text-bleu-800",
                )}
              >
                {lien.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
