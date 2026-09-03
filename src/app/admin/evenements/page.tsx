import Link from "next/link";

import { Badge, EtatVide } from "@/components/ui/primitives";
import { Vignette } from "@/components/ui/vignette";
import { FormulaireEvenement } from "@/components/forms/formulaires-admin";
import { basculerPublicationEvenement } from "@/lib/actions/admin";
import { formaterPlage } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Evenement } from "@/lib/supabase/types";

export default async function PageAdminEvenements() {
  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("evenements").select("*").order("debut_le", { ascending: false })
    : { data: null };

  const evenements = (data ?? []) as Evenement[];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Événements ({evenements.length})
        </h2>

        <div className="mt-6">
          {evenements.length ? (
            <ul className="space-y-3">
              {evenements.map((evenement) => (
                <li
                  key={evenement.id}
                  className="rounded-2xl border border-bleu-100 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-4">
                      <Vignette
                        graine={evenement.slug}
                        src={evenement.image_url}
                        className="h-14 w-20 shrink-0"
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

                  <form action={basculerPublicationEvenement} className="mt-3">
                    <input type="hidden" name="id" value={evenement.id} />
                    <input type="hidden" name="publie" value={String(evenement.publie)} />
                    <button
                      type="submit"
                      className="rounded-full border border-bleu-200 px-4 py-1.5 text-xs font-semibold text-bleu-700 hover:bg-bleu-50"
                    >
                      {evenement.publie ? "Dépublier" : "Publier"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide
              titre="Aucun événement"
              texte="Créez le premier événement à l'aide du formulaire ci-contre."
            />
          )}
        </div>
      </section>

      <section className="lg:col-span-5">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Créer ou mettre à jour
        </h2>
        <div className="mt-6 rounded-2xl border border-bleu-100 bg-white p-6">
          <FormulaireEvenement />
        </div>
      </section>
    </div>
  );
}
