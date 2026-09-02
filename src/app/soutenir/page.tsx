import type { Metadata } from "next";
import { Building2, HandCoins, Users2 } from "lucide-react";

import {
  Chapo,
  Conteneur,
  LienBouton,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { ORGANISATION } from "@/content/organisation";

export const metadata: Metadata = {
  title: "Soutenir l'ONG",
  description:
    "Dons, partenariats, mécénat de compétences : les manières de soutenir les actions de prévention de l'ONG A.J.MOND-CI.",
};

const BUDGET_FORUM = [
  { poste: "Tee-shirts et casquettes (300)", montant: "1 050 000" },
  { poste: "Perdiems conférenciers et formateurs (3)", montant: "750 000" },
  { poste: "Perdiems encadreurs (6)", montant: "300 000" },
  { poste: "Rafraîchissements participants (200)", montant: "300 000" },
  { poste: "Don à l'établissement d'accueil", montant: "800 000" },
  { poste: "Gadgets et fournitures pour les élèves", montant: "2 140 000" },
];

const FORMES = [
  {
    icone: HandCoins,
    titre: "Don financier",
    texte:
      "Les dons et legs figurent parmi les ressources statutaires de l'ONG. Tout retrait de fonds est cosigné par le Président et le Trésorier Général, et toute opération est communiquée au Commissaire aux comptes.",
  },
  {
    icone: Building2,
    titre: "Partenariat institutionnel",
    texte:
      "Établissements, DREN, institutions de santé, fondations et entreprises peuvent conventionner avec l'ONG pour financer ou accueillir un forum.",
  },
  {
    icone: Users2,
    titre: "Mécénat de compétences",
    texte:
      "Psychologues, médecins, assistants sociaux, éducateurs et animateurs : votre expertise est directement mobilisable lors des interventions.",
  },
];

export default function PageSoutenir() {
  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Soutenir</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Chaque forum coûte environ 6 millions de FCFA
          </TitreSection>
          <Chapo>
            Le budget prévisionnel de la 2<sup>e</sup> édition du forum s&apos;élève à 39 780 000 FCFA
            pour six établissements de la DREN Abidjan-1. Votre soutien finance directement les
            interventions auprès des élèves.
          </Chapo>
          <div className="mt-8 flex flex-wrap gap-3">
            <LienBouton href="/contact" variante="accent">
              Devenir partenaire
            </LienBouton>
            <LienBouton href="/adhesion" variante="secondaire">
              Adhérer à l&apos;ONG
            </LienBouton>
          </div>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <div className="max-w-3xl">
          <Surtitre>Trois façons d&apos;agir</Surtitre>
          <TitreSection>Comment nous soutenir</TitreSection>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {FORMES.map((forme) => {
            const Icone = forme.icone;
            return (
              <li
                key={forme.titre}
                className="rounded-2xl border border-bleu-100 bg-sable-50/60 p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-bleu-600 shadow-sm">
                  <Icone className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-bleu-900">
                  {forme.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">{forme.texte}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section className="bg-bleu-950 text-white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Surtitre className="text-brique-400">Transparence</Surtitre>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              À quoi sert un forum de 6 130 000 FCFA ?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Détail des principaux postes du budget prévisionnel d&apos;une journée dans un
              établissement, tel que présenté dans le dossier de projet 2024.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              Pour recevoir le dossier de projet complet, écrivez à{" "}
              <a
                href={`mailto:${ORGANISATION.email}`}
                className="font-semibold text-white lien-souligne"
              >
                {ORGANISATION.email}
              </a>
              .
            </p>
          </div>

          <div className="lg:col-span-7">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Postes du budget prévisionnel d&apos;un forum
              </caption>
              <thead>
                <tr className="border-b border-white/15 text-xs uppercase tracking-widest text-white/50">
                  <th scope="col" className="pb-3 font-semibold">
                    Poste
                  </th>
                  <th scope="col" className="pb-3 text-right font-semibold">
                    Montant (FCFA)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {BUDGET_FORUM.map((ligne) => (
                  <tr key={ligne.poste}>
                    <th scope="row" className="py-3.5 pr-4 font-normal text-white/80">
                      {ligne.poste}
                    </th>
                    <td className="py-3.5 text-right font-display font-semibold text-white">
                      {ligne.montant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </>
  );
}
