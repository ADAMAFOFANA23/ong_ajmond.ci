import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge, Conteneur, Section } from "@/components/ui/primitives";
import { trouverArticle } from "@/lib/donnees";
import { formaterDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await trouverArticle(slug);
  if (!article) return { title: "Article introuvable" };

  return { title: article.titre, description: article.chapo ?? undefined };
}

export default async function PageArticle({ params }: Props) {
  const { slug } = await params;
  const article = await trouverArticle(slug);

  if (!article) notFound();

  const paragraphes = article.contenu.split("\n").filter((ligne) => ligne.trim().length > 0);

  return (
    <>
      <section className="motif-vagues border-b border-bleu-100 bg-sable-50">
        <Conteneur className="py-12 lg:py-16">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-bleu-700 hover:text-bleu-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Toutes les actualités
          </Link>

          <div className="mt-6">
            <Badge>{article.categorie}</Badge>
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-bleu-900 sm:text-4xl lg:text-5xl">
            {article.titre}
          </h1>

          <p className="mt-4 text-sm text-bleu-800/60">
            Publié le {formaterDate(article.publie_le ?? article.cree_le)}
            {article.auteur ? ` · ${article.auteur}` : ""}
          </p>
        </Conteneur>
      </section>

      <Section className="bg-white">
        <article className="mx-auto max-w-2xl">
          {article.chapo && (
            <p className="text-lg font-medium leading-relaxed text-bleu-900">{article.chapo}</p>
          )}

          <div className="mt-8 space-y-5">
            {paragraphes.map((paragraphe, index) => (
              <p key={index} className="text-base leading-relaxed text-bleu-800/80">
                {paragraphe}
              </p>
            ))}
          </div>
        </article>
      </Section>
    </>
  );
}
