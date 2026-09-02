import type { Metadata } from "next";

import {
  Chapo,
  Conteneur,
  EtatVide,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { CarteEvenement } from "@/components/sections/cartes";
import { listerEvenements } from "@/lib/donnees";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Agenda des forums, conférences et ateliers de l'ONG A.J.MOND-CI dans les établissements secondaires de Côte d'Ivoire.",
};

export const revalidate = 300;

export default async function PageEvenements() {
  const [aVenir, passes] = await Promise.all([
    listerEvenements({ aVenir: true }),
    listerEvenements({ aVenir: false }),
  ]);

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Agenda</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Nos interventions dans les établissements
          </TitreSection>
          <Chapo>
            Chaque intervention est convenue avec la direction de l&apos;établissement et la DREN.
            Les dates peuvent évoluer selon le calendrier scolaire et la disponibilité des acteurs.
          </Chapo>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <TitreSection>À venir</TitreSection>
        <div className="mt-8">
          {aVenir.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {aVenir.map((evenement) => (
                <li key={evenement.id}>
                  <CarteEvenement evenement={evenement} />
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide
              titre="Aucune date programmée pour le moment"
              texte="Le prochain chronogramme sera publié dès sa validation avec les établissements partenaires."
            />
          )}
        </div>
      </Section>

      {passes.length > 0 && (
        <Section className="bg-sable-50">
          <TitreSection>Éditions passées</TitreSection>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {passes.map((evenement) => (
              <li key={evenement.id}>
                <CarteEvenement evenement={evenement} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
