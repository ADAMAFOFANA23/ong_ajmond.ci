import type { Metadata } from "next";
import { Check } from "lucide-react";

import {
  Badge,
  Chapo,
  Conteneur,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { COTISATIONS, ORGANISATION } from "@/content/organisation";
import { nombreContenu } from "@/lib/contenus";
import { lireContenus, listerPartenaires } from "@/lib/donnees";

export const metadata: Metadata = {
  title: "L'ONG",
  description:
    "Statuts, vision, objectifs, organes et fonctionnement de l'ONG Amie des Jeunes du Monde de Côte d'Ivoire.",
};

export default async function PageAPropos() {
  const [contenus, partenaires] = await Promise.all([lireContenus(), listerPartenaires()]);

  const identite = [
    { cle: "Dénomination", valeur: ORGANISATION.nom },
    { cle: "Sigle", valeur: ORGANISATION.sigle },
    { cle: "Nature juridique", valeur: ORGANISATION.nature },
    { cle: "Cadre légal", valeur: contenus.textes["identite.cadre_legal"] },
    { cle: "Siège social", valeur: contenus.textes["organisation.siege"] },
    { cle: "Adresse postale", valeur: contenus.textes["organisation.boite_postale"] },
    { cle: "Durée", valeur: "Illimitée" },
    { cle: "Présidence", valeur: contenus.textes["identite.presidence"] },
  ];

  // La page listait les partenaires techniques ; ils vivent maintenant en base.
  const partenairesTechniques = partenaires.filter((p) => p.type !== "etablissement");

  const adhesion = nombreContenu(contenus, "cotisation.adhesion", COTISATIONS.adhesion);
  const mensuelle = nombreContenu(contenus, "cotisation.mensuelle", COTISATIONS.mensuelle);

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>L&apos;organisation</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Une ONG née d&apos;un constat sur la jeunesse
          </TitreSection>
          <Chapo>
            « Vu l&apos;état de perdition morale des jeunes de notre société… vu les phénomènes de la
            drogue, de l&apos;alcool, la cigarette, le vol, la prostitution qui sévissent dans nos
            lycées et collèges, nous avons choisi de nous rapprocher de la jeunesse par la
            sensibilisation. »
          </Chapo>
          <p className="mt-3 text-sm font-medium text-bleu-800/60">
            Préambule des statuts de l&apos;ONG A.J.MOND-CI, 2019
          </p>
        </Conteneur>
      </section>

      {/* Identité */}
      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Surtitre>Carte d&apos;identité</Surtitre>
            <TitreSection>Ce que disent les statuts</TitreSection>
            <Chapo>
              L&apos;ONG est fondée entre les personnes physiques ou morales adhérant à ses statuts.
              Elle est apolitique, à but non lucratif, et sa durée est illimitée.
            </Chapo>
          </div>

          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {identite.map((ligne) => (
              <div key={ligne.cle} className="border-t border-bleu-100 pt-4">
                <dt className="text-xs font-semibold uppercase tracking-widest text-bleu-800/50">
                  {ligne.cle}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-bleu-900">{ligne.valeur}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Vision et objectifs */}
      <Section className="bg-bleu-950 text-white">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Surtitre className="text-brique-400">Vision</Surtitre>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {contenus.textes["statuts.vision_titre"]}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{contenus.textes["statuts.vision_texte"]}</p>

            <h3 className="mt-10 font-display text-lg font-semibold text-white">Objectif général</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{contenus.textes["statuts.objectif_general"]}</p>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">Objectifs spécifiques</h3>
            <ul className="mt-4 space-y-3">
              {contenus.listes["statuts.objectifs_specifiques"].map((objectif) => (
                <li
                  key={objectif.texte}
                  className="flex gap-3 text-sm leading-relaxed text-white/75"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brique-400" aria-hidden />
                  {objectif.texte}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-lg font-semibold text-white">Nos stratégies</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {contenus.listes["statuts.strategies"].map((strategie) => (
                <li
                  key={strategie.texte}
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80"
                >
                  {strategie.texte}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Organes */}
      <Section className="bg-white">
        <div className="max-w-3xl">
          <Surtitre>Gouvernance</Surtitre>
          <TitreSection>Les organes de l&apos;ONG</TitreSection>
          <Chapo>
            Les mandats électifs durent trois ans. L&apos;Assemblée Générale ordinaire se réunit
            obligatoirement tous les six mois ; elle délibère lorsque le tiers des membres actifs est
            présent.
          </Chapo>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {contenus.listes["statuts.organes"].map((organe, index) => (
            <li key={organe.nom} className="rounded-2xl border border-bleu-100 bg-sable-50/60 p-6">
              <span className="font-display text-xs font-bold text-brique-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-bleu-900">{organe.nom}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">{organe.role}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Membres et ressources */}
      <Section className="bg-sable-50">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Surtitre>Membres</Surtitre>
            <TitreSection>Quatre catégories de membres bénévoles</TitreSection>
            <Chapo>
              A qualité de membre toute personne physique ou morale qui s&apos;est acquittée de son
              droit d&apos;adhésion et qui participe aux activités statutaires.
            </Chapo>

            <div className="mt-8 rounded-2xl border border-bleu-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-bleu-900">Ressources</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-bleu-800/70">Droit d&apos;adhésion</dt>
                  <dd className="font-display text-lg font-bold text-bleu-700">
                    {adhesion.toLocaleString("fr-FR")} {COTISATIONS.devise}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-bleu-800/70">Cotisation mensuelle</dt>
                  <dd className="font-display text-lg font-bold text-bleu-700">
                    {mensuelle.toLocaleString("fr-FR")} {COTISATIONS.devise}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-bleu-800/60">{contenus.textes["cotisation.note"]}</p>
            </div>
          </div>

          <ul className="space-y-4 lg:col-span-7">
            {contenus.listes["statuts.types_membres"].map((type) => (
              <li key={type.nom} className="rounded-2xl border border-bleu-100 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-bleu-900">{type.nom}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">{type.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Historique */}
      <Section className="bg-white">
        <div className="max-w-3xl">
          <Surtitre>Parcours</Surtitre>
          <TitreSection>Nos étapes depuis 2019</TitreSection>
        </div>

        <ol className="mt-12 space-y-0 border-l-2 border-bleu-100 pl-6 sm:pl-8">
          {contenus.listes["statuts.historique"].map((etape) => (
            <li key={etape.annee} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brique-500 sm:-left-[2.4rem]"
              />
              <Badge ton="brique">{etape.annee}</Badge>
              <h3 className="mt-3 font-display text-lg font-semibold text-bleu-900">{etape.titre}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-bleu-800/70">
                {etape.texte}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Partenaires */}
      <Section className="bg-sable-50">
        <div className="max-w-3xl">
          <Surtitre>Écosystème</Surtitre>
          <TitreSection>Nos partenaires techniques</TitreSection>
          <Chapo>
            Nos interventions s&apos;appuient sur des psychologues, des médecins psychiatres, des
            spécialistes des sciences de l&apos;éducation et sur les autorités éducatives et
            sanitaires.
          </Chapo>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partenairesTechniques.map((partenaire) => (
            <li
              key={partenaire.id}
              className="rounded-2xl border border-bleu-100 bg-white p-6 text-sm font-medium leading-relaxed text-bleu-900"
            >
              {partenaire.nom}
              {partenaire.ville && (
                <span className="mt-1 block text-xs font-normal text-bleu-800/55">
                  {partenaire.ville}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
