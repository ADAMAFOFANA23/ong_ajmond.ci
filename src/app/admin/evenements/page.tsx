import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Badge, EtatVide, cn } from "@/components/ui/primitives";
import { Vignette } from "@/components/ui/vignette";
import { FormulaireEvenement } from "@/components/forms/formulaires-admin";
import { basculerPublicationEvenement } from "@/lib/actions/admin";
import { formaterPlage } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Evenement } from "@/lib/supabase/types";

export default async function PageAdminEvenements({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string }>;
}) {
  const { edition } = await searchParams;

  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("evenements").select("*").order("debut_le", { ascending: false })
    : { data: null };

  const evenements = (data ?? []) as Evenement[];

  // L'événement à modifier est déjà dans la liste : inutile de le relire.
  const enEdition = edition ? (evenements.find((e) => e.slug === edition) ?? null) : null;

  return (
    <div className="grid gap-8 xl:grid-cols-12">
      <section className="xl:col-span-7">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Événements ({evenements.length})
        </h2>

        <div className="mt-6">
          {evenements.length ? (
            <ul className="space-y-3">
              {evenements.map((evenement) => {
                const actif = enEdition?.id === evenement.id;
                return (
                  <li
                    key={evenement.id}
                    className={cn(
                      "rounded-2xl border bg-white p-5 transition-colors",
                      actif ? "border-bleu-400 ring-1 ring-bleu-200" : "border-craie-300",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-4">
                        <Vignette
                          graine={evenement.slug}
                          src={evenement.image_url}
                          className="h-14 w-20 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-bleu-900">
                            <Link href={`/evenements/${evenement.slug}`} className="lien-souligne">
                              {evenement.titre}
                            </Link>
                          </p>
                          <p className="chiffres mt-1 text-xs text-bleu-800/60">
                            {formaterPlage(evenement.debut_le, evenement.fin_le)}
                            {evenement.etablissement ? ` · ${evenement.etablissement}` : ""}
                          </p>
                        </div>
                      </div>
                      <Badge ton={evenement.publie ? "vert" : "neutre"}>
                        {evenement.publie ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={
                          actif ? "/admin/evenements" : `/admin/evenements?edition=${evenement.slug}`
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                          actif
                            ? "bg-bleu-900 text-white hover:bg-bleu-800"
                            : "border border-craie-300 text-bleu-800 hover:border-bleu-300",
                        )}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        {actif ? "En cours de modification" : "Modifier"}
                      </Link>

                      <form action={basculerPublicationEvenement}>
                        <input type="hidden" name="id" value={evenement.id} />
                        <input type="hidden" name="publie" value={String(evenement.publie)} />
                        <button
                          type="submit"
                          className="rounded-lg border border-craie-300 px-3 py-1.5 text-xs font-semibold text-bleu-800 transition-colors hover:border-bleu-300"
                        >
                          {evenement.publie ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EtatVide
              titre="Aucun événement"
              texte="Créez le premier événement à l'aide du formulaire ci-contre."
            />
          )}
        </div>
      </section>

      <section className="xl:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            {enEdition ? "Modifier l'événement" : "Créer un événement"}
          </h2>
          {enEdition && (
            <Link
              href="/admin/evenements"
              className="inline-flex items-center gap-1.5 rounded-full bg-bleu-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-bleu-800"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Nouveau
            </Link>
          )}
        </div>

        {enEdition && (
          <p className="mt-2 text-xs text-bleu-800/60">
            Vous modifiez «&nbsp;{enEdition.titre}&nbsp;». Enregistrer écrase la version publiée.
          </p>
        )}

        <div className="mt-5 rounded-2xl border border-craie-300 bg-white p-6">
          {/* La clé force le remontage : sans elle, React garderait les valeurs
              du formulaire précédent en passant d'un événement à l'autre. */}
          <FormulaireEvenement key={enEdition?.id ?? "nouveau"} evenement={enEdition} />
        </div>
      </section>
    </div>
  );
}
