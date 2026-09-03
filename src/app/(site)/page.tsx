import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Ear,
  GraduationCap,
  Handshake,
  Sprout,
} from "lucide-react";

import { CadrePhoto } from "@/components/ui/cadre-photo";
import {
  CarrouselPartenaires,
  type CartePartenaire,
} from "@/components/sections/carrousel-partenaires";
import { nombreContenu } from "@/lib/contenus";
import { lireContenus, listerPartenaires } from "@/lib/donnees";
import type { Partenaire } from "@/lib/supabase/types";
import { LienBouton } from "@/components/ui/primitives";
import {
  COTISATIONS,
  ETABLISSEMENTS_PARTENAIRES,
  ORGANISATION,
  PARTENAIRES_TECHNIQUES,
  PROGRAMMES,
  VISION,
} from "@/content/organisation";

export const metadata: Metadata = {
  description:
    "A.J.MOND-CI intervient dans les lycées et collèges de Côte d'Ivoire contre la drogue, l'alcool, le tabac, les violences et la prostitution : sensibilisation, écoute, formation des encadreurs et réinsertion.",
};

/*
 * Les missions sont éditables et ne portent pas d'icône : celle-ci suit le
 * rang dans la liste. Une mission ajoutée au-delà de la quatrième reçoit
 * l'icône générique plutôt qu'aucune.
 */
const ICONES_MISSION = [Handshake, GraduationCap, Ear, Sprout] as const;

/**
 * Quatre publics se partagent cette page (cf. PRODUCT.md). Plutôt que de
 * s'adresser à leur moyenne, le ruban sous le hero les nomme et les oriente.
 */
const PARCOURS = [
  {
    public: "Parents",
    promesse:
      "Repérer les signes, savoir à qui parler et faire accompagner votre enfant.",
    href: "/contact",
    action: "Nous écrire",
  },
  {
    public: "Membres et bénévoles",
    promesse:
      "Rejoindre l'ONG, participer aux interventions et suivre la vie statutaire.",
    href: "/adhesion",
    action: "Adhérer",
  },
  {
    public: "Établissements et pouvoirs publics",
    promesse:
      "Accueillir un forum ou une campagne de sensibilisation dans votre établissement.",
    href: "/contact",
    action: "Demander une intervention",
  },
  {
    public: "Donateurs et partenaires",
    promesse:
      "Financer une édition du forum ou le projet de centre d'accueil et de réinsertion.",
    href: "/soutenir",
    action: "Soutenir l'ONG",
  },
];

const forum = PROGRAMMES[0];

export default async function PageAccueil() {
  // Surcharges saisies par le bureau ; à défaut, les textes du code.
  const [contenus, partenaires] = await Promise.all([lireContenus(), listerPartenaires()]);

  // Table vide — base neuve ou migration non jouée : on retombe sur les
  // listes livrées dans le code plutôt que d'afficher une section vide.
  const enCartes = (liste: Partenaire[]): CartePartenaire[] =>
    liste.map((partenaire) => ({
      cle: partenaire.id,
      nom: partenaire.nom,
      ville: partenaire.ville,
      logoUrl: partenaire.logo_url,
      siteUrl: partenaire.site_url,
    }));

  const depuisNoms = (noms: readonly string[]): CartePartenaire[] =>
    noms.map((nom) => ({ cle: nom, nom }));

  const adhesion = nombreContenu(contenus, "cotisation.adhesion", COTISATIONS.adhesion);
  const mensuelle = nombreContenu(contenus, "cotisation.mensuelle", COTISATIONS.mensuelle);

  const etablissements = enCartes(partenaires.filter((p) => p.type === "etablissement"));
  const autresPartenaires = enCartes(partenaires.filter((p) => p.type !== "etablissement"));

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="sur-sombre relative bg-bleu-950 text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-28 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-36 lg:pt-24">
          <div>
            <span
              aria-hidden
              className="ouverture-filet block h-px w-24 bg-brique-500"
            />

            <h1 className="ouverture-titre ouverture-delai-1 mt-8 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[0.98] tracking-[-0.03em]">
              {contenus.textes["accueil.titre"]}
            </h1>

            <p className="ouverture-titre ouverture-delai-2 mt-7 max-w-[62ch] text-lg leading-relaxed text-bleu-100/80">
              {contenus.textes["accueil.chapo"]}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <LienBouton href="/adhesion" variante="accent">
                Adhérer à l&apos;ONG
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LienBouton>
              <LienBouton
                href="/actions"
                variante="fantome"
                className="border border-white/25 text-white hover:bg-white/10"
              >
                Découvrir nos actions
              </LienBouton>
            </div>

            <dl className="mt-14 grid gap-x-8 gap-y-4 border-t border-white/15 pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-bleu-100/55">Siège</dt>
                <dd className="mt-1 font-medium">{contenus.textes["organisation.siege"]}</dd>
              </div>
              <div>
                <dt className="text-bleu-100/55">Statut</dt>
                <dd className="mt-1 font-medium">{ORGANISATION.nature}</dd>
              </div>
              <div>
                <dt className="text-bleu-100/55">Active depuis</dt>
                <dd className="chiffres mt-1 font-medium">2019</dd>
              </div>
            </dl>
          </div>

          <CadrePhoto
            ton="sombre"
            largeur={1200}
            hauteur={1500}
            src={contenus.textes["accueil.photo_hero"] || undefined}
            alt="Intervention de l'ONG dans un établissement"
            sujet="Portrait vertical d'une intervention en lycée : élèves en atelier ou intervenant face à une classe."
            className="aspect-[4/5] w-full lg:aspect-[4/5]"
          />
        </div>
      </section>

      {/* ------------------------------------------- Ruban : par public */}
      <section className="relative bg-craie-100">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-20 bg-white shadow-[0_18px_50px_-24px_rgba(17,26,48,0.45)]">
            <h2 className="border-b border-craie-200 px-6 py-5 text-sm font-semibold uppercase tracking-[0.14em] text-bleu-800/60 sm:px-10">
              Vous êtes
            </h2>

            <ul>
              {PARCOURS.map((parcours) => (
                <li key={parcours.public} className="border-b border-craie-200 last:border-b-0">
                  <Link
                    href={parcours.href}
                    className="ligne-remplie group flex flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:gap-8 sm:px-10"
                  >
                    <span className="font-display text-xl font-semibold text-bleu-900 sm:w-[19rem] sm:shrink-0">
                      {parcours.public}
                    </span>
                    <span className="flex-1 text-[15px] leading-relaxed text-bleu-800/75">
                      {parcours.promesse}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brique-600">
                      {parcours.action}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Les chiffres */}
      <section className="bg-craie-100 py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.05] text-bleu-900">
              Ce que disent les enquêtes
            </h2>
            <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-bleu-800/80">
              {contenus.textes["statuts.objectif_general"]}
            </p>
            <p className="mt-5 max-w-[65ch] leading-relaxed text-bleu-800/70">
              Les données ci-contre viennent de nos propres enquêtes en établissement et des
              travaux publiés sur les usages de drogues en Côte d&apos;Ivoire. Chacune porte sa
              source.
            </p>
          </div>

          <dl className="border-t border-craie-300">
            {contenus.listes["statuts.chiffres"].map((chiffre) => (
              <div
                key={chiffre.libelle}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-b border-craie-300 py-6 sm:gap-x-10"
              >
                <dt className="chiffres font-display text-4xl font-semibold leading-none text-brique-600 sm:text-5xl">
                  {chiffre.valeur}
                </dt>
                <dd>
                  <p className="text-[15px] leading-snug text-bleu-900">{chiffre.libelle}</p>
                  <p className="mt-1.5 text-xs leading-snug text-bleu-800/55">
                    Source : {chiffre.source}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------- Missions */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.05] text-bleu-900">
              Quatre missions statutaires
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bleu-800/80">
              {VISION.texte}
            </p>
          </div>

          <ul className="mt-14 border-t border-craie-200">
            {contenus.listes["statuts.missions"].map((mission, rang) => {
              const Icone = ICONES_MISSION[rang] ?? Handshake;
              return (
                <li key={mission.titre} className="border-b border-craie-200">
                  <div className="grid gap-3 py-8 sm:grid-cols-[3rem_18rem_1fr] sm:items-start sm:gap-8">
                    <Icone
                      className="h-7 w-7 text-brique-500"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <h3 className="font-display text-xl font-semibold text-bleu-900">
                      {mission.titre}
                    </h3>
                    <p className="max-w-[68ch] leading-relaxed text-bleu-800/75">
                      {mission.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- Forum */}
      <section className="sur-sombre bg-bleu-950 py-20 text-white lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="chiffres text-sm font-medium text-brique-400">{forum.edition}</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.5vw,3.25rem)] font-light leading-[1.05]">
                {forum.titre}
              </h2>
              <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-bleu-100/80">
                {contenus.textes["accueil.forum_description"]}
              </p>

              <CadrePhoto
                ton="sombre"
                largeur={1400}
                hauteur={900}
                src={contenus.textes["accueil.photo_forum"] || undefined}
                alt="Plénière du Forum d'échanges"
                sujet="Plénière du forum : salle d'établissement, élèves assis, intervenant au micro."
                className="mt-10 aspect-[14/9] w-full"
              />
            </div>

            <div>
              <h3 className="border-b border-white/20 pb-4 text-sm font-semibold uppercase tracking-[0.14em] text-bleu-100/60">
                Déroulé d&apos;une matinée
              </h3>
              <ol>
                {forum.deroule.map((etape) => (
                  <li
                    key={etape.horaire}
                    className="ligne-remplie grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-white/12 px-2 py-4"
                  >
                    <span className="chiffres text-sm text-bleu-100/60">{etape.horaire}</span>
                    <span className="text-[15px] leading-snug">{etape.intitule}</span>
                  </li>
                ))}
              </ol>

              <LienBouton
                href="/evenements"
                variante="fantome"
                className="mt-8 border border-white/25 text-white hover:bg-white/10"
              >
                Voir les prochaines dates
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </LienBouton>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Partenaires */}
      <section className="bg-craie-100 py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.05] text-bleu-900">
            Où nous intervenons, avec qui
          </h2>

          <p className="mt-5 max-w-[68ch] text-lg leading-relaxed text-bleu-800/80">
            Chaque intervention est convenue avec la direction de l&apos;établissement et la
            DREN. Les travaux s&apos;appuient sur des équipes universitaires et sur les services
            publics de santé et d&apos;éducation.
          </p>

          <div className="mt-12 space-y-14">
            <CarrouselPartenaires
              titre="Établissements partenaires"
              icone="etablissement"
              partenaires={
                etablissements.length
                  ? etablissements
                  : depuisNoms(ETABLISSEMENTS_PARTENAIRES)
              }
            />

            <CarrouselPartenaires
              titre="Partenaires techniques et institutionnels"
              icone="institution"
              partenaires={
                autresPartenaires.length
                  ? autresPartenaires
                  : depuisNoms(PARTENAIRES_TECHNIQUES)
              }
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Historique */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.05] text-bleu-900">
            Depuis 2019
          </h2>

          <ol className="mt-12 border-t border-craie-200">
            {contenus.listes["statuts.historique"].map((etape) => (
              <li
                key={etape.annee}
                className="grid gap-2 border-b border-craie-200 py-8 sm:grid-cols-[7rem_1fr] sm:gap-10"
              >
                <span className="chiffres font-display text-2xl font-semibold text-brique-600">
                  {etape.annee}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-bleu-900">
                    {etape.titre}
                  </h3>
                  <p className="mt-2 max-w-[68ch] leading-relaxed text-bleu-800/75">
                    {etape.texte}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------- Adhésion */}
      <section className="bg-craie-100 py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.05] text-bleu-900">
              Devenir membre
            </h2>
            <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-bleu-800/80">
              L&apos;adhésion ouvre le droit de vote en Assemblée Générale et l&apos;éligibilité aux
              postes du Bureau Exécutif. Elle finance directement les interventions en
              établissement.
            </p>

            <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-6 border-y border-craie-300 py-8">
              <p>
                <span className="chiffres block font-display text-4xl font-semibold text-bleu-900">
                  {adhesion.toLocaleString("fr-FR")} {COTISATIONS.devise}
                </span>
                <span className="mt-1 block text-sm text-bleu-800/65">
                  droit d&apos;adhésion, une seule fois
                </span>
              </p>
              <p>
                <span className="chiffres block font-display text-4xl font-semibold text-bleu-900">
                  {mensuelle.toLocaleString("fr-FR")} {COTISATIONS.devise}
                </span>
                <span className="mt-1 block text-sm text-bleu-800/65">par mois</span>
              </p>
            </div>

            <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-bleu-800/65">
              {contenus.textes["cotisation.note"]}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <LienBouton href="/adhesion" variante="accent">
                Demander une adhésion
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LienBouton>
              <LienBouton href="/soutenir" variante="secondaire">
                Faire un don
              </LienBouton>
            </div>
          </div>

          <div>
            <h3 className="border-b border-craie-300 pb-4 text-sm font-semibold uppercase tracking-[0.14em] text-bleu-800/60">
              Quatre qualités de membre
            </h3>
            <dl>
              {contenus.listes["statuts.types_membres"].map((type) => (
                <div key={type.nom} className="border-b border-craie-300 py-6">
                  <dt className="font-display text-lg font-semibold text-bleu-900">{type.nom}</dt>
                  <dd className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-bleu-800/75">
                    {type.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Contact */}
      <section className="sur-sombre bg-bleu-950 py-20 text-white lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:px-8">
          <div>
            <h2 className="font-display text-[clamp(1.9rem,3vw,2.75rem)] font-light leading-[1.1]">
              {contenus.textes["accueil.contact_titre"]}
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-bleu-100/80">
              Écrivez-nous ou appelez le bureau. Chaque demande d&apos;intervention est étudiée
              avec la direction de l&apos;établissement et la DREN.
            </p>
            <LienBouton href="/contact" variante="accent" className="mt-8">
              Nous contacter
              <ArrowRight className="h-4 w-4" aria-hidden />
            </LienBouton>
          </div>

          <dl className="grid gap-5 border-t border-white/15 pt-8 text-sm lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div>
              <dt className="text-bleu-100/55">Courriel</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${contenus.textes["organisation.email"]}`}
                  className="lien-souligne font-medium"
                >
                  {contenus.textes["organisation.email"]}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-bleu-100/55">Téléphone</dt>
              <dd className="chiffres mt-1 space-y-1">
                {[contenus.textes["organisation.telephone1"], contenus.textes["organisation.telephone2"]]
                  .filter(Boolean)
                  .map((numero) => (
                  <a
                    key={numero}
                    href={`tel:${numero.replace(/\s/g, "")}`}
                    className="lien-souligne block font-medium"
                  >
                    {numero}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-bleu-100/55">Adresse</dt>
              <dd className="mt-1 font-medium">
                {contenus.textes["organisation.siege"]} — {contenus.textes["organisation.boite_postale"]}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
