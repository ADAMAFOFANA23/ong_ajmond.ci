import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";

import { Badge, Conteneur, Section } from "@/components/ui/primitives";
import { Vignette } from "@/components/ui/vignette";
import { FormulaireInscriptionEvenement } from "@/components/forms/formulaire-inscription-evenement";
import { PROGRAMMES } from "@/content/organisation";
import { trouverEvenement } from "@/lib/donnees";
import { estAVenir, formaterPlage } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evenement = await trouverEvenement(slug);
  if (!evenement) return { title: "Événement introuvable" };

  return {
    title: evenement.titre,
    description: evenement.chapo ?? undefined,
  };
}

export default async function PageEvenement({ params }: Props) {
  const { slug } = await params;
  const evenement = await trouverEvenement(slug);

  if (!evenement) notFound();

  const aVenir = estAVenir(evenement.debut_le);
  const programme = PROGRAMMES.find((p) => p.slug === evenement.programme);

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-12 lg:py-16">
          <Link
            href="/evenements"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-bleu-700 hover:text-bleu-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour à l&apos;agenda
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge ton={aVenir ? "vert" : "neutre"}>{aVenir ? "À venir" : "Édition passée"}</Badge>
            {programme && <Badge ton="brique">{programme.titre}</Badge>}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-bleu-900 sm:text-4xl lg:text-5xl">
            {evenement.titre}
          </h1>

          {evenement.chapo && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bleu-800/75">
              {evenement.chapo}
            </p>
          )}

          <Vignette
            graine={evenement.slug}
            src={evenement.image_url}
            alt=""
            legende={[evenement.etablissement, evenement.ville].filter(Boolean).join(" · ")}
            className="mt-8 aspect-[21/9] w-full"
          />
        </Conteneur>
      </section>

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <dl className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-bleu-100 bg-sable-50/60 p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bleu-800/55">
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  Date
                </dt>
                <dd className="mt-2 text-sm font-medium text-bleu-900">
                  {formaterPlage(evenement.debut_le, evenement.fin_le)}
                </dd>
              </div>

              <div className="rounded-2xl border border-bleu-100 bg-sable-50/60 p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bleu-800/55">
                  <MapPin className="h-4 w-4" aria-hidden />
                  Lieu
                </dt>
                <dd className="mt-2 text-sm font-medium text-bleu-900">
                  {[evenement.etablissement, evenement.lieu, evenement.ville]
                    .filter(Boolean)
                    .join(" — ") || "À préciser"}
                </dd>
              </div>

              {evenement.capacite && (
                <div className="rounded-2xl border border-bleu-100 bg-sable-50/60 p-5">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bleu-800/55">
                    <Users className="h-4 w-4" aria-hidden />
                    Capacité
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-bleu-900">
                    {evenement.capacite} participants
                  </dd>
                </div>
              )}
            </dl>

            {evenement.description && (
              <div className="mt-10 space-y-4">
                {evenement.description.split("\n").filter(Boolean).map((paragraphe) => (
                  <p key={paragraphe} className="text-base leading-relaxed text-bleu-800/80">
                    {paragraphe}
                  </p>
                ))}
              </div>
            )}

            {programme && programme.deroule.length > 0 && (
              <div className="mt-10 overflow-hidden rounded-2xl border border-bleu-100">
                <p className="border-b border-bleu-100 bg-sable-50 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-bleu-800/60">
                  Déroulé de la journée
                </p>
                <ul className="divide-y divide-bleu-100">
                  {programme.deroule.map((etape) => (
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

          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-bleu-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-bleu-900">
                {aVenir && evenement.inscriptions_ouvertes
                  ? "S'inscrire à cet événement"
                  : "Inscriptions closes"}
              </h2>

              {aVenir && evenement.inscriptions_ouvertes ? (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">
                    L&apos;inscription est gratuite. Elle nous permet de dimensionner la logistique et
                    de préparer les diplômes de participation.
                  </p>
                  <div className="mt-6">
                    <FormulaireInscriptionEvenement
                      evenementId={evenement.id}
                      slug={evenement.slug}
                      etablissement={evenement.etablissement}
                    />
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-bleu-800/70">
                  Cet événement n&apos;accepte plus d&apos;inscription. Consultez l&apos;agenda pour
                  les prochaines dates ou contactez-nous pour accueillir une intervention dans votre
                  établissement.
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
