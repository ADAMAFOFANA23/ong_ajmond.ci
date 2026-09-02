import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Conteneur, Message } from "@/components/ui/primitives";
import { FormulaireConnexion } from "@/components/forms/formulaires-auth";
import { profilCourant } from "@/lib/supabase/server";
import { raisonSupabaseAbsent } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accéder à l'espace membre de l'ONG A.J.MOND-CI.",
};

type Props = { searchParams: Promise<{ suite?: string }> };

export default async function PageConnexion({ searchParams }: Props) {
  const profil = await profilCourant();
  if (profil) redirect(profil.role === "admin" ? "/admin" : "/espace-membre");

  const { suite } = await searchParams;
  const raisonSupabase = raisonSupabaseAbsent();

  return (
    <Conteneur className="flex min-h-[70vh] items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-bleu-900">Espace membre</h1>
        <p className="mt-2 text-sm text-bleu-800/70">
          Connectez-vous pour suivre vos cotisations, vos inscriptions et les convocations aux
          Assemblées Générales.
        </p>

        <div className="mt-8 rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm sm:p-8">
          {raisonSupabase && (
            <div className="mb-6">
              <Message ton="info">{raisonSupabase}</Message>
            </div>
          )}
          <FormulaireConnexion suite={suite} />
        </div>

        <p className="mt-6 text-center text-sm text-bleu-800/70">
          Pas encore de compte ?{" "}
          <Link href="/creer-compte" className="font-semibold text-bleu-700 lien-souligne">
            En créer un
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-bleu-800/70">
          Vous souhaitez d&apos;abord rejoindre l&apos;ONG ?{" "}
          <Link href="/adhesion" className="font-semibold text-bleu-700 lien-souligne">
            Demander une adhésion
          </Link>
        </p>
      </div>
    </Conteneur>
  );
}
