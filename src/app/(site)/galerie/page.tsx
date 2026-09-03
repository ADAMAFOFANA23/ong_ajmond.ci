import type { Metadata } from "next";
import Image from "next/image";

import {
  Chapo,
  Conteneur,
  EtatVide,
  Section,
  Surtitre,
  TitreSection,
} from "@/components/ui/primitives";
import { listerMedias } from "@/lib/donnees";
import { formaterDateCourte } from "@/lib/format";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Photos des conférences, forums et ateliers menés par l'ONG A.J.MOND-CI dans les lycées de Côte d'Ivoire.",
};

export const revalidate = 300;

export default async function PageGalerie() {
  const medias = await listerMedias();

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-16 lg:py-20">
          <Surtitre>Galerie</Surtitre>
          <TitreSection niveau={1} className="max-w-3xl">
            Nos activités en images
          </TitreSection>
          <Chapo>
            Conférences, travaux en atelier, remises de dons : quelques moments des activités menées
            depuis 2019 dans les établissements partenaires.
          </Chapo>
        </Conteneur>
      </section>

      <Section className="bg-white">
        {medias.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {medias.map((media) => (
              <li key={media.id} className="group overflow-hidden rounded-2xl border border-bleu-100">
                <div className="relative aspect-[4/3] bg-bleu-50">
                  <Image
                    src={media.url}
                    alt={media.titre}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-base font-semibold text-bleu-900">
                    {media.titre}
                  </h2>
                  {media.legende && (
                    <p className="mt-1.5 text-sm leading-relaxed text-bleu-800/70">{media.legende}</p>
                  )}
                  <p className="mt-3 text-xs uppercase tracking-wider text-bleu-800/45">
                    {[media.lieu, media.prise_le ? formaterDateCourte(media.prise_le) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide
            titre="La galerie est en cours de constitution"
            texte="Les photos des conférences et des forums seront ajoutées depuis l'espace d'administration."
          />
        )}
      </Section>
    </>
  );
}
