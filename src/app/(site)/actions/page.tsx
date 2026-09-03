import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import {
  Badge,
  Chapo,
  Conteneur,
  LienBouton,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { Vignette } from "@/components/ui/vignette";
import { etapesDuDeroule, identifiantDepuis } from "@/lib/contenus";
import { lireContenus } from "@/lib/donnees";

export const metadata: Metadata = {
  title: "Nos actions",
  description:
    "Forums d'échanges, sensibilisation en milieu scolaire, formation des encadreurs et réinsertion : les programmes de l'ONG A.J.MOND-CI.",
};

export default async function PageActions() {
  const contenus = await lireContenus();
  const programmes = contenus.listes["programmes.liste"];

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Nos actions</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Quatre programmes, une même chaîne d&apos;accompagnement
          </TitreSection>
          <Chapo>
            De la sensibilisation de masse jusqu&apos;à la réinsertion professionnelle, chaque
            programme prend le relais du précédent. L&apos;objectif : qu&apos;aucun jeune repéré ne
            reste sans suite.
          </Chapo>
          <div className="mt-8">
            <LienBouton href="/evenements" variante="accent">
              Voir l&apos;agenda des interventions
              <ArrowRight className="h-4 w-4" aria-hidden />
            </LienBouton>
          </div>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <ul className="space-y-16">
          {programmes.map((programme) => {
            const identifiant = identifiantDepuis(programme.titre);
            const deroule = etapesDuDeroule(programme.deroule);

            return (
            <li key={identifiant} id={identifiant} className="scroll-mt-28">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  {/*
                    Visuel propre à chaque programme, dérivé de son titre :
                    l'ONG n'a pas encore de photothèque, mais aucune action ne
                    reste sans élément visuel. Voir src/components/ui/vignette.
                  */}
                  <Vignette graine={identifiant} className="aspect-[4/3] w-full" />
                  <Badge ton="brique" className="mt-4">
                    {programme.edition}
                  </Badge>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="font-display text-2xl font-bold leading-tight text-bleu-900 sm:text-3xl">
                    {programme.titre}
                  </h2>
                  <p className="mt-3 text-base font-medium text-brique-600">{programme.accroche}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bleu-800/75">
                    {programme.description}
                  </p>

                  {deroule.length > 0 && (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-bleu-100">
                      <p className="flex items-center gap-2 border-b border-bleu-100 bg-sable-50 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-bleu-800/60">
                        <Clock className="h-4 w-4" aria-hidden />
                        Déroulé type d&apos;une journée
                      </p>
                      <ul className="divide-y divide-bleu-100">
                        {deroule.map((etape) => (
                          <li
                            key={etape.horaire}
                            className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:gap-6"
                          >
                            <span className="w-32 shrink-0 font-display text-sm font-semibold text-bleu-700">
                              {etape.horaire}
                            </span>
                            <span className="text-sm text-bleu-800/75">{etape.intitule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </li>
            );
          })}
        </ul>
      </Section>

      <Section className="bg-bleu-950 text-white">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Surtitre className="text-brique-400">Méthodologie</Surtitre>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              Sept étapes, du repérage à la réinsertion
            </h2>
            <ol className="mt-8 space-y-4">
              {contenus.listes["statuts.strategies"].map((strategie, index) => (
                <li key={strategie.texte} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brique-500/15 font-display text-sm font-bold text-brique-400">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm leading-relaxed text-white/75">{strategie.texte}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <Surtitre className="text-brique-400">Bénéficiaires</Surtitre>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              Qui accompagnons-nous ?
            </h2>
            <ul className="mt-8 space-y-4">
              {contenus.listes["statuts.cibles"].map((cible) => (
                <li key={cible.titre} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="font-display text-base font-semibold text-white">{cible.titre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{cible.detail}</p>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm leading-relaxed text-white/60">
              Vous représentez un établissement et souhaitez accueillir une intervention ?{" "}
              <Link href="/contact" className="font-semibold text-white lien-souligne">
                Écrivez-nous
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
