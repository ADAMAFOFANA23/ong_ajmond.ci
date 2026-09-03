import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import {
  Chapo,
  Conteneur,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { FormulaireAdhesion } from "@/components/forms/formulaire-adhesion";
import { COTISATIONS, TYPES_MEMBRES } from "@/content/organisation";

export const metadata: Metadata = {
  title: "Adhérer",
  description:
    "Devenir membre de l'ONG A.J.MOND-CI : droits, devoirs, cotisations et formulaire de demande d'adhésion.",
};

const DROITS = [
  "Être candidat à tout poste électif de l'ONG",
  "Voter lors des élections",
  "Participer aux Assemblées Générales",
  "Demander des informations aux différents organes",
];

export default function PageAdhesion() {
  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Adhésion</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Rejoignez l&apos;ONG A.J.MOND-CI
          </TitreSection>
          <Chapo>
            L&apos;ONG regroupe toutes les personnes volontaires désirant apporter leur soutien à
            l&apos;encadrement, à l&apos;éducation et à la formation des jeunes, en particulier des
            élèves en difficulté.
          </Chapo>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-xl font-semibold text-bleu-900">
              Ce que prévoit le règlement intérieur
            </h2>

            <div className="mt-6 rounded-2xl border border-bleu-200 bg-bleu-50/50 p-6">
              <dl className="space-y-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-bleu-800/75">Droit d&apos;adhésion (une fois)</dt>
                  <dd className="font-display text-xl font-bold text-bleu-700">
                    {COTISATIONS.adhesion.toLocaleString("fr-FR")} {COTISATIONS.devise}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-bleu-200/70 pt-4">
                  <dt className="text-sm text-bleu-800/75">Cotisation mensuelle</dt>
                  <dd className="font-display text-xl font-bold text-bleu-700">
                    {COTISATIONS.mensuelle.toLocaleString("fr-FR")} {COTISATIONS.devise}
                  </dd>
                </div>
              </dl>
            </div>

            <h3 className="mt-10 font-display text-base font-semibold text-bleu-900">
              Droits du membre actif
            </h3>
            <ul className="mt-4 space-y-2.5">
              {DROITS.map((droit) => (
                <li key={droit} className="flex gap-3 text-sm leading-relaxed text-bleu-800/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brique-500" aria-hidden />
                  {droit}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-base font-semibold text-bleu-900">
              Catégories de membres
            </h3>
            <ul className="mt-4 space-y-4">
              {TYPES_MEMBRES.map((type) => (
                <li key={type.cle} className="border-l-2 border-bleu-100 pl-4">
                  <p className="text-sm font-semibold text-bleu-900">{type.nom}</p>
                  <p className="mt-1 text-sm leading-relaxed text-bleu-800/70">{type.description}</p>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm leading-relaxed text-bleu-800/65">
              Vous avez déjà un compte ?{" "}
              <Link href="/connexion" className="font-semibold text-bleu-700 lien-souligne">
                Connectez-vous à votre espace membre
              </Link>
              .
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-xl font-semibold text-bleu-900">
                Demande d&apos;adhésion
              </h2>
              <p className="mt-1.5 text-sm text-bleu-800/70">
                Le Bureau Exécutif est chargé de constituer le dossier de chaque nouveau membre. Vous
                serez recontacté après examen de votre demande.
              </p>
              <div className="mt-6">
                <FormulaireAdhesion />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
