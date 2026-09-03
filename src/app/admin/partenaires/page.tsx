import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, ExternalLink, Pencil, Plus } from "lucide-react";

import { FormulairePartenaire } from "@/components/forms/formulaires-admin";
import { Badge, EtatVide, cn } from "@/components/ui/primitives";
import { basculerPublicationPartenaire, retirerPartenaire } from "@/lib/actions/admin";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Partenaire, TypePartenaire } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Partenaires" };

const LIBELLES_TYPE: Record<TypePartenaire, string> = {
  etablissement: "Établissements scolaires",
  technique: "Partenaires techniques",
  institutionnel: "Institutions publiques",
  soutien: "Soutiens et bailleurs",
};

const ORDRE_TYPES: TypePartenaire[] = [
  "etablissement",
  "technique",
  "institutionnel",
  "soutien",
];

export default async function PageAdminPartenaires({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string }>;
}) {
  const { edition } = await searchParams;

  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("partenaires").select("*").order("type").order("ordre").order("nom")
    : { data: null };

  const partenaires = (data ?? []) as Partenaire[];
  const enEdition = edition ? (partenaires.find((p) => p.id === edition) ?? null) : null;

  return (
    <div className="grid gap-8 xl:grid-cols-12">
      <section className="xl:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            Partenaires ({partenaires.length})
          </h2>
          <p className="text-xs text-bleu-800/55">
            Les partenaires publiés apparaissent sur la page d&apos;accueil.
          </p>
        </div>

        <div className="mt-6 space-y-8">
          {partenaires.length ? (
            ORDRE_TYPES.filter((type) => partenaires.some((p) => p.type === type)).map((type) => (
              <div key={type}>
                <h3 className="border-b border-craie-300 pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-bleu-800/55">
                  {LIBELLES_TYPE[type]}
                </h3>

                <ul className="mt-3 space-y-3">
                  {partenaires
                    .filter((partenaire) => partenaire.type === type)
                    .map((partenaire) => {
                      const actif = enEdition?.id === partenaire.id;
                      return (
                        <li
                          key={partenaire.id}
                          className={cn(
                            "rounded-2xl border bg-white p-4 transition-colors",
                            actif ? "border-bleu-400 ring-1 ring-bleu-200" : "border-craie-300",
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-4">
                              {/* Le logo manque presque toujours au départ :
                                  un cadre neutre vaut mieux qu'un trou. */}
                              <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-craie-200 bg-craie-50">
                                {partenaire.logo_url ? (
                                  <Image
                                    src={partenaire.logo_url}
                                    alt=""
                                    fill
                                    sizes="64px"
                                    className="object-contain p-1.5"
                                  />
                                ) : (
                                  <Building2
                                    className="h-5 w-5 text-bleu-800/25"
                                    strokeWidth={1.5}
                                    aria-hidden
                                  />
                                )}
                              </span>

                              <div className="min-w-0">
                                <p className="font-medium leading-snug text-bleu-900">
                                  {partenaire.nom}
                                </p>
                                <p className="chiffres mt-1 text-xs text-bleu-800/60">
                                  {[partenaire.ville, `ordre ${partenaire.ordre}`]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                                {partenaire.site_url && (
                                  <a
                                    href={partenaire.site_url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-bleu-700 hover:text-bleu-900"
                                  >
                                    Site
                                    <ExternalLink className="h-3 w-3" aria-hidden />
                                  </a>
                                )}
                              </div>
                            </div>

                            <Badge ton={partenaire.publie ? "vert" : "neutre"}>
                              {partenaire.publie ? "Publié" : "Masqué"}
                            </Badge>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                              href={
                                actif
                                  ? "/admin/partenaires"
                                  : `/admin/partenaires?edition=${partenaire.id}`
                              }
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                                actif
                                  ? "bg-bleu-900 text-white hover:bg-bleu-800"
                                  : "border border-craie-300 text-bleu-800 hover:border-bleu-300",
                              )}
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              {actif ? "En cours" : "Modifier"}
                            </Link>

                            <form action={basculerPublicationPartenaire}>
                              <input type="hidden" name="id" value={partenaire.id} />
                              <input
                                type="hidden"
                                name="publie"
                                value={String(partenaire.publie)}
                              />
                              <button
                                type="submit"
                                className="rounded-lg border border-craie-300 px-3 py-1.5 text-xs font-semibold text-bleu-800 transition-colors hover:border-bleu-300"
                              >
                                {partenaire.publie ? "Masquer" : "Publier"}
                              </button>
                            </form>

                            <form action={retirerPartenaire}>
                              <input type="hidden" name="id" value={partenaire.id} />
                              <button
                                type="submit"
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brique-600 transition-colors hover:bg-brique-50"
                              >
                                Supprimer
                              </button>
                            </form>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))
          ) : (
            <EtatVide
              titre="Aucun partenaire"
              texte="Ajoutez le premier établissement avec le formulaire ci-contre. Il apparaîtra sur la page d'accueil."
            />
          )}
        </div>
      </section>

      <section className="xl:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            {enEdition ? "Modifier le partenaire" : "Ajouter un partenaire"}
          </h2>
          {enEdition && (
            <Link
              href="/admin/partenaires"
              className="inline-flex items-center gap-1.5 rounded-full bg-bleu-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-bleu-800"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Nouveau
            </Link>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-craie-300 bg-white p-6">
          <FormulairePartenaire key={enEdition?.id ?? "nouveau"} partenaire={enEdition} />
        </div>
      </section>
    </div>
  );
}
