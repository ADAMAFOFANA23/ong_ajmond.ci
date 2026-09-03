import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Conteneur } from "@/components/ui/primitives";
import { FormulaireCreationCompte } from "@/components/forms/formulaires-auth";
import { profilCourant } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créer un compte membre pour accéder à l'espace personnel de l'ONG A.J.MOND-CI.",
};

export default async function PageCreationCompte() {
  const profil = await profilCourant();
  if (profil) redirect("/espace-membre");

  return (
    <Conteneur className="py-16">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="font-display text-3xl font-bold text-bleu-900">Créer un compte</h1>
        <p className="mt-2 text-sm text-bleu-800/70">
          Le compte donne accès au suivi de vos cotisations et de vos inscriptions. Il ne remplace pas
          la demande d&apos;adhésion, qui reste examinée par le Bureau Exécutif.
        </p>

        <div className="mt-8 rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm sm:p-8">
          <FormulaireCreationCompte />
        </div>

        <p className="mt-6 text-center text-sm text-bleu-800/70">
          Vous avez déjà un compte ?{" "}
          <Link href="/connexion" className="font-semibold text-bleu-700 lien-souligne">
            Se connecter
          </Link>
        </p>
      </div>
    </Conteneur>
  );
}
