import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Badge, EtatVide, cn } from "@/components/ui/primitives";
import { Vignette } from "@/components/ui/vignette";
import { FormulaireEvenement } from "@/components/forms/formulaires-admin";
import { basculerPublicationEvenement, supprimerEvenement } from "@/lib/actions/admin";
import { formaterPlage } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Evenement } from "@/lib/supabase/types";

export default async function PageAdminEvenements({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string; suppression?: string; desaccord?: string }>;
}) {
  const { edition, suppression, desaccord } = await searchParams;

  const supabase = await creerClientServeur();

  const [{ data }, { data: inscriptions }] = await Promise.all([
    supabase
      ? await supabase.from("evenements").select("*").order("debut_le", { ascending: false })
      : Promise.resolve({ data: null }),
    supabase
      ? await supabase.from("inscriptions").select("evenement_id")
      : Promise.resolve({ data: null }),
  ]);

  const evenements = (data ?? []) as Evenement[];

  // Nombre d'inscriptions par événement : c'est ce que la suppression
  // emporterait, et c'est donc ce qu'il faut annoncer avant de la proposer.
  const inscriptionsPar = new Map<string, number>();
  for (const ligne of (inscriptions ?? []) as Array<{ evenement_id: string }>) {
    inscriptionsPar.set(ligne.evenement_id, (inscriptionsPar.get(ligne.evenement_id) ?? 0) + 1);
  }

  const aSupprimer = suppression
    ? (evenements.find((e) => e.id === suppression) ?? null)
    : null;
  const inscriptionsPerdues = aSupprimer ? (inscriptionsPar.get(aSupprimer.id) ?? 0) : 0;

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

                      <Link
                        href={`/admin/evenements?suppression=${evenement.id}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brique-600 transition-colors hover:bg-brique-50"
                      >
                        Supprimer
                      </Link>
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
        {aSupprimer && (
          <div className="mb-6 rounded-2xl border border-brique-300 bg-brique-50 p-5">
            <h2 className="font-display text-lg font-semibold text-brique-800">
              Supprimer cet événement ?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-bleu-900">
              {aSupprimer.titre}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-bleu-800/80">
              {inscriptionsPerdues > 0 ? (
                <>
                  <strong className="chiffres font-semibold text-brique-700">
                    {inscriptionsPerdues} inscription{inscriptionsPerdues > 1 ? "s" : ""}
                  </strong>{" "}
                  {inscriptionsPerdues > 1 ? "seront supprimées" : "sera supprimée"} avec lui.
                  Cette action est définitive : les coordonnées des inscrits ne seront pas
                  récupérables.
                </>
              ) : (
                <>Aucune inscription n&apos;y est rattachée. Les photos de la galerie liées à cet
                événement seront conservées, simplement détachées.</>
              )}
            </p>

            {desaccord === "1" && (
              <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-medium text-brique-700">
                Le nombre d&apos;inscriptions a changé depuis l&apos;affichage de cet
                avertissement. Rien n&apos;a été supprimé : vérifiez le nouveau décompte
                ci-dessus avant de confirmer.
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <form action={supprimerEvenement}>
                <input type="hidden" name="id" value={aSupprimer.id} />
                <input type="hidden" name="inscriptions" value={inscriptionsPerdues} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brique-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brique-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Supprimer définitivement
                </button>
              </form>

              <Link
                href="/admin/evenements"
                className="inline-flex items-center rounded-lg border border-craie-300 bg-white px-4 py-2 text-xs font-semibold text-bleu-800 transition-colors hover:border-bleu-400"
              >
                Annuler
              </Link>
            </div>
          </div>
        )}

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
