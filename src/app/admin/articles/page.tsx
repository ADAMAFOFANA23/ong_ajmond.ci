import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Badge, EtatVide, cn } from "@/components/ui/primitives";
import { Vignette } from "@/components/ui/vignette";
import { FormulaireArticle } from "@/components/forms/formulaires-admin";
import { basculerPublicationArticle } from "@/lib/actions/admin";
import { formaterDateCourte } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/types";

export default async function PageAdminArticles({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string }>;
}) {
  const { edition } = await searchParams;

  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("articles").select("*").order("cree_le", { ascending: false })
    : { data: null };

  const articles = (data ?? []) as Article[];
  const enEdition = edition ? (articles.find((a) => a.slug === edition) ?? null) : null;

  return (
    <div className="grid gap-8 xl:grid-cols-12">
      <section className="xl:col-span-7">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Actualités ({articles.length})
        </h2>

        <div className="mt-6">
          {articles.length ? (
            <ul className="space-y-3">
              {articles.map((article) => {
                const actif = enEdition?.id === article.id;
                return (
                  <li
                    key={article.id}
                    className={cn(
                      "rounded-2xl border bg-white p-5 transition-colors",
                      actif ? "border-bleu-400 ring-1 ring-bleu-200" : "border-craie-300",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-4">
                        <Vignette
                          graine={article.slug}
                          src={article.couverture_url}
                          className="h-14 w-20 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-bleu-900">
                            <Link href={`/actualites/${article.slug}`} className="lien-souligne">
                              {article.titre}
                            </Link>
                          </p>
                          <p className="chiffres mt-1 text-xs text-bleu-800/60">
                            {article.categorie} ·{" "}
                            {formaterDateCourte(article.publie_le ?? article.cree_le)}
                          </p>
                        </div>
                      </div>
                      <Badge ton={article.publie ? "vert" : "neutre"}>
                        {article.publie ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={actif ? "/admin/articles" : `/admin/articles?edition=${article.slug}`}
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

                      <form action={basculerPublicationArticle}>
                        <input type="hidden" name="id" value={article.id} />
                        <input type="hidden" name="publie" value={String(article.publie)} />
                        <button
                          type="submit"
                          className="rounded-lg border border-craie-300 px-3 py-1.5 text-xs font-semibold text-bleu-800 transition-colors hover:border-bleu-300"
                        >
                          {article.publie ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EtatVide
              titre="Aucun article"
              texte="Publiez un compte rendu d'activité depuis le formulaire ci-contre."
            />
          )}
        </div>
      </section>

      <section className="xl:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            {enEdition ? "Modifier l'article" : "Rédiger"}
          </h2>
          {enEdition && (
            <Link
              href="/admin/articles"
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
          <FormulaireArticle key={enEdition?.id ?? "nouveau"} article={enEdition} />
        </div>
      </section>
    </div>
  );
}
