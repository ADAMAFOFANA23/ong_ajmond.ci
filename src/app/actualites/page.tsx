import type { Metadata } from "next";

import {
  Chapo,
  Conteneur,
  EtatVide,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { CarteArticle } from "@/components/sections/cartes";
import { listerArticles } from "@/lib/donnees";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Comptes rendus d'interventions, études et prises de parole de l'ONG A.J.MOND-CI sur la prévention en milieu scolaire.",
};

export const revalidate = 300;

export default async function PageActualites() {
  const articles = await listerArticles();

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Actualités</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Nos publications et comptes rendus
          </TitreSection>
          <Chapo>
            Ce que nous observons dans les établissements, les données sur lesquelles nous nous
            appuyons et les retours de nos interventions.
          </Chapo>
        </Conteneur>
      </section>

      <Section className="bg-white">
        {articles.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.id}>
                <CarteArticle article={article} />
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide
            titre="Aucune publication pour le moment"
            texte="Les comptes rendus d'activités seront publiés ici au fil des interventions."
          />
        )}
      </Section>
    </>
  );
}
