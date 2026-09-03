import { Mail, Phone } from "lucide-react";

import { Entete } from "@/components/layout/entete";
import { PiedDePage } from "@/components/layout/pied-de-page";
import { ORGANISATION } from "@/content/organisation";
import { profilCourant } from "@/lib/supabase/server";

/**
 * Chrome du site public : bandeau de contact, en-tête, pied de page.
 * L'administration ne passe pas par ici.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profil = await profilCourant();

  return (
    <>
      <div className="sur-sombre bg-bleu-900 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-8 gap-y-1 px-4 py-2 text-[13px] sm:px-6 lg:px-8">
          <a
            href={`mailto:${ORGANISATION.email}`}
            className="lien-souligne inline-flex items-center gap-2"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            {ORGANISATION.email}
          </a>
          <a
            href={`tel:${ORGANISATION.telephones[0].replace(/\s/g, "")}`}
            className="chiffres lien-souligne inline-flex items-center gap-2"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            {ORGANISATION.telephones[0]}
          </a>
          <span className="ml-auto hidden text-bleu-100/60 lg:inline">
            {ORGANISATION.siege}
          </span>
        </div>
      </div>

      <Entete connecte={Boolean(profil)} admin={profil?.role === "admin"} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage />
    </>
  );
}
