import type { Metadata } from "next";

import { Conteneur, Section, Surtitre, TitreSection } from "@/components/ui/primitives";
import { ORGANISATION } from "@/content/organisation";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et politique de confidentialité du site de l'ONG A.J.MOND-CI.",
};

export default function PageMentionsLegales() {
  return (
    <>
      <section className="border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-14">
          <Surtitre>Informations légales</Surtitre>
          <TitreSection niveau={1}>Mentions légales et confidentialité</TitreSection>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-2xl space-y-10 text-sm leading-relaxed text-bleu-800/80">
          <section>
            <h2 className="font-display text-lg font-semibold text-bleu-900">Éditeur du site</h2>
            <p className="mt-3">
              {ORGANISATION.nom} ({ORGANISATION.sigle}), {ORGANISATION.nature.toLowerCase()}.
              <br />
              {ORGANISATION.cadreLegal}
              <br />
              Siège social : {ORGANISATION.siege} — {ORGANISATION.boitePostale}.
              <br />
              Contact : {ORGANISATION.email} — {ORGANISATION.telephones.join(" / ")}.
              <br />
              Directrice de la publication : {ORGANISATION.presidente}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-bleu-900">
              Données personnelles
            </h2>
            <p className="mt-3">
              Les informations transmises via les formulaires (adhésion, contact, inscription aux
              événements) sont collectées pour le seul traitement de votre demande par le Bureau
              Exécutif de l&apos;ONG. Elles ne font l&apos;objet d&apos;aucune cession à des tiers.
            </p>
            <p className="mt-3">
              Les données sont hébergées sur l&apos;infrastructure Supabase et protégées par des
              politiques d&apos;accès au niveau de chaque ligne : seuls les administrateurs de
              l&apos;ONG et, le cas échéant, la personne concernée peuvent y accéder.
            </p>
            <p className="mt-3">
              Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en
              écrivant à {ORGANISATION.email}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-bleu-900">
              Données concernant les mineurs
            </h2>
            <p className="mt-3">
              Les inscriptions d&apos;élèves aux forums sont réalisées avec l&apos;accord de
              l&apos;établissement d&apos;accueil. Aucune donnée de santé n&apos;est collectée par ce
              site. Les échanges tenus lors des espaces d&apos;écoute restent confidentiels et ne sont
              consignés dans aucun système informatique.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-bleu-900">Cookies</h2>
            <p className="mt-3">
              Ce site ne dépose aucun cookie publicitaire ni traceur de mesure d&apos;audience. Seuls
              des cookies techniques de session sont utilisés pour maintenir la connexion à
              l&apos;espace membre.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-bleu-900">Propriété intellectuelle</h2>
            <p className="mt-3">
              Le logo, la dénomination et les contenus publiés sur ce site sont la propriété de
              l&apos;ONG {ORGANISATION.sigle}. Toute reproduction sans autorisation préalable est
              interdite.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
