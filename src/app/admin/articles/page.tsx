import Link from "next/link";

import { Badge, EtatVide } from "@/components/ui/primitives";
import { FormulaireArticle } from "@/components/forms/formulaires-admin";
import { basculerPublicationArticle } from "@/lib/actions/admin";
import { formaterDateCourte } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/types";

export default async function PageAdminArticles() {
  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("articles").select("*").order("cree_le", { ascending: false })
    : { data: null };

  const articles = (data ?? []) as Article[];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Actualités ({articles.length})
        </h2>

        <div className="mt-6">
          {articles.length ? (
            <ul className="space-y-3">
              {articles.map((article) => (
                <li key={article.id} className="rounded-2xl border border-bleu-100 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-bleu-900">
                        <Link href={`/actualites/${article.slug}`} className="lien-souligne">
                          {article.titre}
                        </Link>
                      </p>
                      <p className="mt-1 text-xs text-bleu-800/60">
                        {article.categorie} · {formaterDateCourte(article.publie_le ?? article.cree_le)}
                      </p>
                    </div>
                    <Badge ton={article.publie ? "vert" : "neutre"}>
                      {article.publie ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>

                  <form action={basculerPublicationArticle} className="mt-3">
                    <input type="hidden" name="id" value={article.id} />
                    <input type="hidden" name="publie" value={String(article.publie)} />
                    <button
                      type="submit"
                      className="rounded-full border border-bleu-200 px-4 py-1.5 text-xs font-semibold text-bleu-700 hover:bg-bleu-50"
                    >
                      {article.publie ? "Dépublier" : "Publier"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <EtatVide
              titre="Aucun article"
              texte="Publiez un compte rendu d'activité depuis le formulaire ci-contre."
            />
          )}
        </div>
      </section>

      <section className="lg:col-span-5">
        <h2 className="font-display text-xl font-semibold text-bleu-900">Rédiger</h2>
        <div className="mt-6 rounded-2xl border border-bleu-100 bg-white p-6">
          <FormulaireArticle />
        </div>
      </section>
    </div>
  );
}
