import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Ear,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Sprout,
  Target,
} from "lucide-react";

import {
  Badge,
  Chapo,
  Conteneur,
  EtatVide,
  LienBouton,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { CarteArticle, CarteEvenement } from "@/components/sections/cartes";
import {
  CHIFFRES,
  CIBLES,
  ETABLISSEMENTS_PARTENAIRES,
  MISSIONS,
  OBJECTIF_GENERAL,
  PROGRAMMES,
  VISION,
} from "@/content/organisation";
import { listerArticles, listerEvenements } from "@/lib/donnees";

const ICONES = {
  handshake: Handshake,
  graduation: GraduationCap,
  ear: Ear,
  sprout: Sprout,
} as const;

export default async function PageAccueil() {
  const [evenements, articles] = await Promise.all([
    listerEvenements({ aVenir: true, limite: 3 }),
    listerArticles(3),
  ]);

  const evenementsAffiches = evenements.length ? evenements : await listerEvenements({ limite: 3 });

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="motif-vagues relative overflow-hidden border-b border-bleu-100 bg-sable-50">
        <Conteneur className="relative grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Surtitre>ONG ivoirienne · Abidjan · depuis 2019</Surtitre>
            <TitreSection niveau={1}>
              Promotion d&apos;une{" "}
              <span className="relative whitespace-nowrap text-brique-600">jeunesse responsable</span>
            </TitreSection>
            <Chapo className="text-lg">
              L&apos;ONG <strong className="font-semibold text-bleu-900">A.J.MOND-CI</strong> va à la
              rencontre des élèves des lycées et collèges de Côte d&apos;Ivoire pour prévenir la drogue,
              l&apos;alcool, le tabac, les violences et la prostitution — par la sensibilisation,
              l&apos;écoute, la formation et la réinsertion.
            </Chapo>

            <div className="mt-8 flex flex-wrap gap-3">
              <LienBouton href="/adhesion" variante="accent">
                Devenir membre
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LienBouton>
              <LienBouton href="/actions" variante="secondaire">
                Découvrir nos actions
              </LienBouton>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-bleu-200/70 pt-6 sm:grid-cols-4">
              {[
                { valeur: "7", libelle: "établissements partenaires" },
                { valeur: "5", libelle: "objectifs spécifiques" },
                { valeur: "4", libelle: "missions statutaires" },
                { valeur: "6e→Tle", libelle: "niveaux concernés" },
              ].map((item) => (
                <div key={item.libelle}>
                  <dt className="font-display text-2xl font-bold text-bleu-700">{item.valeur}</dt>
                  <dd className="mt-1 text-xs leading-snug text-bleu-800/65">{item.libelle}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div
                aria-hidden
                className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-bleu-600 via-bleu-700 to-bleu-950"
              />
              <div
                aria-hidden
                className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-brique-500/90 blur-[2px]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-10 text-center">
                <div className="rounded-3xl bg-white/95 p-6 shadow-xl">
                  <Image
                    src="/brand/logo-ajmond-ci.svg"
                    alt="Logo de l'ONG A.J.MOND-CI"
                    width={120}
                    height={120}
                    priority
                    className="h-24 w-24"
                  />
                </div>
                <p className="font-display text-xl font-semibold leading-snug text-white">
                  « Amie des Jeunes du Monde de Côte d&apos;Ivoire »
                </p>
                <p className="text-sm leading-relaxed text-white/70">
                  Se rapprocher de la jeunesse par la sensibilisation : conférences, projections,
                  débats ouverts, ateliers et échanges personnalisés.
                </p>
              </div>
            </div>
          </div>
        </Conteneur>
      </section>

      {/* ------------------------------------------------------- Le constat */}
      <Section className="bg-white">
        <div className="max-w-3xl">
          <Surtitre>Le constat</Surtitre>
          <TitreSection>
            La consommation de substances est courante chez les élèves du secondaire
          </TitreSection>
          <Chapo>
            L&apos;enseignement secondaire est une période de transition critique. Les enquêtes
            nationales et nos propres relevés de terrain convergent : c&apos;est là que se jouent les
            premières consommations, souvent sous l&apos;influence des camarades.
          </Chapo>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHIFFRES.map((chiffre) => (
            <li
              key={chiffre.libelle}
              className="rounded-2xl border border-bleu-100 bg-sable-50 p-6"
            >
              <p className="font-display text-4xl font-bold text-brique-600">{chiffre.valeur}</p>
              <p className="mt-3 text-sm font-medium leading-snug text-bleu-900">{chiffre.libelle}</p>
              <p className="mt-3 text-xs leading-relaxed text-bleu-800/55">{chiffre.source}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------------------- Missions */}
      <Section className="bg-bleu-950 text-white">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Surtitre className="text-brique-400">Nos missions</Surtitre>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {VISION.titre}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{VISION.texte}</p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brique-400">
                <Target className="h-4 w-4" aria-hidden />
                Objectif général
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{OBJECTIF_GENERAL}</p>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {MISSIONS.map((mission) => {
              const Icone = ICONES[mission.icone as keyof typeof ICONES] ?? Handshake;
              return (
                <li
                  key={mission.titre}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brique-500/15 text-brique-400">
                    <Icone className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {mission.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{mission.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* ------------------------------------------------------ Programmes */}
      <Section className="bg-white">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Surtitre>Nos programmes</Surtitre>
            <TitreSection>De la sensibilisation de masse au suivi individuel</TitreSection>
          </div>
          <Link
            href="/actions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bleu-700 lien-souligne"
          >
            Tous nos programmes
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {PROGRAMMES.map((programme, index) => (
            <li
              key={programme.slug}
              className={
                index === 0
                  ? "rounded-2xl border border-bleu-200 bg-bleu-50/60 p-8 md:col-span-2"
                  : "rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm"
              }
            >
              <Badge ton={index === 0 ? "brique" : "neutre"}>{programme.edition}</Badge>
              <h3
                className={`mt-4 font-display font-semibold text-bleu-900 ${
                  index === 0 ? "text-2xl" : "text-lg"
                }`}
              >
                {programme.titre}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">{programme.accroche}</p>
              <Link
                href={`/actions#${programme.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brique-600 hover:text-brique-700"
              >
                En savoir plus
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------ Événements */}
      <Section className="bg-sable-50">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Surtitre>Agenda</Surtitre>
            <TitreSection>Nos prochaines interventions</TitreSection>
          </div>
          <Link
            href="/evenements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bleu-700 lien-souligne"
          >
            Tout l&apos;agenda
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          {evenementsAffiches.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {evenementsAffiches.map((evenement) => (
                <li key={evenement.id}>
                  <CarteEvenement evenement={evenement} />
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide
              titre="Aucun événement publié"
              texte="Le calendrier des interventions sera mis en ligne dès la validation du chronogramme avec les établissements."
            />
          )}
        </div>
      </Section>

      {/* --------------------------------------------------------- Public */}
      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Surtitre>Nos bénéficiaires</Surtitre>
            <TitreSection>À l&apos;école et en dehors de l&apos;école</TitreSection>
            <Chapo>
              Nos interventions se déploient dans les lycées et collèges de Côte d&apos;Ivoire, ainsi
              que dans les villes, quartiers et zones vulnérables où les jeunes sont les plus exposés.
            </Chapo>
          </div>

          <div className="lg:col-span-7">
            <ul className="space-y-4">
              {CIBLES.map((cible) => (
                <li
                  key={cible.titre}
                  className="rounded-2xl border border-bleu-100 bg-sable-50/70 p-6"
                >
                  <h3 className="font-display text-lg font-semibold text-bleu-900">{cible.titre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-bleu-800/70">{cible.detail}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-bleu-800/50">
                Établissements partenaires
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {ETABLISSEMENTS_PARTENAIRES.map((etablissement) => (
                  <li key={etablissement}>
                    <Badge ton="neutre">{etablissement}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ Actualités */}
      {articles.length > 0 && (
        <Section className="bg-sable-50">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Surtitre>Actualités</Surtitre>
              <TitreSection>Ce que nous observons sur le terrain</TitreSection>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-bleu-700 lien-souligne"
            >
              Toutes les actualités
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <li key={article.id}>
                <CarteArticle article={article} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ------------------------------------------------------------- CTA */}
      <Section className="bg-white">
        <div className="overflow-hidden rounded-3xl bg-bleu-600 px-8 py-14 text-center sm:px-14">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <HeartHandshake className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            Rejoignez celles et ceux qui accompagnent la jeunesse ivoirienne
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75">
            Droit d&apos;adhésion de 5 000 FCFA, cotisation mensuelle de 1 000 FCFA. Chaque membre
            participe aux Assemblées Générales et aux activités de terrain.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LienBouton href="/adhesion" className="bg-white text-bleu-700 hover:bg-sable-100">
              Adhérer à l&apos;ONG
            </LienBouton>
            <LienBouton
              href="/soutenir"
              className="border border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              Soutenir autrement
            </LienBouton>
          </div>
        </div>
      </Section>
    </>
  );
}
