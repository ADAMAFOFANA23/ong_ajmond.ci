import type { Metadata } from "next";
import Image from "next/image";

import { FormulaireMedia } from "@/components/forms/formulaires-admin";
import { Badge, EtatVide } from "@/components/ui/primitives";
import { basculerPublicationMedia, retirerMedia } from "@/lib/actions/admin";
import { formaterDateCourte } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Evenement, Media } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Galerie" };

export default async function PageAdminGalerie() {
  const supabase = await creerClientServeur();

  const [{ data: mediasBruts }, { data: evenementsBruts }] = await Promise.all([
    supabase
      ? supabase.from("medias").select("*").order("cree_le", { ascending: false })
      : Promise.resolve({ data: null }),
    supabase
      ? supabase.from("evenements").select("id, titre").order("debut_le", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  const medias = (mediasBruts ?? []) as Media[];
  const evenements = (evenementsBruts ?? []) as Pick<Evenement, "id" | "titre">[];

  return (
    <div className="grid gap-8 xl:grid-cols-12">
      <section className="xl:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            Photothèque ({medias.length})
          </h2>
          <p className="text-xs text-bleu-800/55">
            Les photos publiées alimentent la page Galerie du site.
          </p>
        </div>

        <div className="mt-6">
          {medias.length ? (
            <ul className="grid gap-5 sm:grid-cols-2">
              {medias.map((media) => (
                <li
                  key={media.id}
                  className="overflow-hidden rounded-2xl border border-craie-300 bg-white"
                >
                  <div className="relative aspect-[4/3] w-full bg-craie-100">
                    <Image
                      src={media.url}
                      alt={media.legende ?? media.titre}
                      fill
                      sizes="(min-width: 640px) 22rem, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 font-medium leading-snug text-bleu-900">
                        {media.titre}
                      </p>
                      <Badge ton={media.publie ? "vert" : "neutre"}>
                        {media.publie ? "Publiée" : "Masquée"}
                      </Badge>
                    </div>

                    {media.legende && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-bleu-800/65">
                        {media.legende}
                      </p>
                    )}

                    <p className="chiffres mt-2 text-xs text-bleu-800/55">
                      {[media.lieu, media.prise_le ? formaterDateCourte(media.prise_le) : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <form action={basculerPublicationMedia}>
                        <input type="hidden" name="id" value={media.id} />
                        <input type="hidden" name="publie" value={String(media.publie)} />
                        <button
                          type="submit"
                          className="rounded-lg border border-craie-300 px-3 py-1.5 text-xs font-semibold text-bleu-800 transition-colors hover:border-bleu-300"
                        >
                          {media.publie ? "Masquer" : "Publier"}
                        </button>
                      </form>

                      <form action={retirerMedia}>
                        <input type="hidden" name="id" value={media.id} />
                        <button
                          type="submit"
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brique-600 transition-colors hover:bg-brique-50"
                        >
                          Retirer
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide
              titre="Aucune photo"
              texte="Ajoutez la première photo avec le formulaire ci-contre. Elle apparaîtra sur la page Galerie du site."
            />
          )}
        </div>
      </section>

      <section className="xl:col-span-5">
        <h2 className="font-display text-xl font-semibold text-bleu-900">Ajouter une photo</h2>
        <div className="mt-6 rounded-2xl border border-craie-300 bg-white p-6">
          <FormulaireMedia evenements={evenements} />
        </div>
      </section>
    </div>
  );
}
