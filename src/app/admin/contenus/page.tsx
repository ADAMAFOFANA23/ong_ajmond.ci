import type { Metadata } from "next";

import { FormulaireContenus } from "@/components/forms/formulaires-admin";
import { lireContenus } from "@/lib/donnees";

export const metadata: Metadata = { title: "Contenus du site" };

export default async function PageAdminContenus() {
  const valeurs = await lireContenus();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-bleu-900">Contenus du site</h2>
        <p className="mt-3 max-w-[70ch] leading-relaxed text-bleu-800/75">
          Ces champs remplacent les textes et les images livrés avec le site. Un champ laissé
          vide n&apos;efface rien : le texte d&apos;origine, tiré des statuts et des documents de
          l&apos;ONG, reprend sa place. Les modifications sont visibles immédiatement sur le site
          public.
        </p>
      </div>

      <div className="rounded-2xl border border-craie-300 bg-white p-6 sm:p-8">
        <FormulaireContenus valeurs={valeurs} />
      </div>
    </div>
  );
}
