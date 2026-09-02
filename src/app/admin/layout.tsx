import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Bouton, Conteneur } from "@/components/ui/primitives";
import { NavigationAdmin } from "@/components/layout/navigation-admin";
import { seDeconnecter } from "@/lib/actions/auth";
import { profilAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profil = await profilAdmin();
  if (!profil) redirect("/connexion?suite=/admin");

  return (
    <div className="bg-sable-50/60">
      <div className="border-b border-bleu-100 bg-white">
        <Conteneur className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brique-600">
              Administration
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-bleu-900">
              Pilotage de l&apos;ONG
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-bleu-800/65 sm:inline">
              {profil.prenoms} {profil.nom}
            </span>
            <form action={seDeconnecter}>
              <Bouton variante="secondaire" className="px-4 py-2 text-xs">
                Déconnexion
              </Bouton>
            </form>
          </div>
        </Conteneur>
        <Conteneur className="pb-3">
          <NavigationAdmin />
        </Conteneur>
      </div>

      <Conteneur className="py-10">{children}</Conteneur>
    </div>
  );
}
