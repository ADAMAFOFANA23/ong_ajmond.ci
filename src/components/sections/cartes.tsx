import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { Badge, Carte } from "@/components/ui/primitives";
import { estAVenir, formaterDateCourte, formaterHeure } from "@/lib/format";
import type { Article, Evenement } from "@/lib/supabase/types";

export function CarteEvenement({ evenement }: { evenement: Evenement }) {
  const aVenir = estAVenir(evenement.debut_le);

  return (
    <Carte className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <Badge ton={aVenir ? "vert" : "neutre"}>{aVenir ? "À venir" : "Passé"}</Badge>
        <span className="text-xs font-semibold uppercase tracking-wider text-bleu-800/50">
          {formaterDateCourte(evenement.debut_le)}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-bleu-900">
        <Link href={`/evenements/${evenement.slug}`} className="lien-souligne">
          {evenement.titre}
        </Link>
      </h3>

      {evenement.chapo && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-bleu-800/70">{evenement.chapo}</p>
      )}

      <dl className="mt-5 space-y-2 text-sm text-bleu-800/70">
        <div className="flex items-start gap-2">
          <dt className="sr-only">Date</dt>
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-bleu-500" aria-hidden />
          <dd>
            {formaterDateCourte(evenement.debut_le)}
            {" · "}
            {formaterHeure(evenement.debut_le)}
          </dd>
        </div>
        {(evenement.etablissement || evenement.ville) && (
          <div className="flex items-start gap-2">
            <dt className="sr-only">Lieu</dt>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bleu-500" aria-hidden />
            <dd>{[evenement.etablissement, evenement.ville].filter(Boolean).join(" · ")}</dd>
          </div>
        )}
      </dl>

      <Link
        href={`/evenements/${evenement.slug}`}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brique-600 hover:text-brique-700"
      >
        Voir le détail
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
    </Carte>
  );
}

export function CarteArticle({ article }: { article: Article }) {
  return (
    <Carte className="flex h-full flex-col">
      <Badge>{article.categorie}</Badge>
      <h3 className="mt-4 text-lg font-semibold leading-snug text-bleu-900">
        <Link href={`/actualites/${article.slug}`} className="lien-souligne">
          {article.titre}
        </Link>
      </h3>
      {article.chapo && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-bleu-800/70">{article.chapo}</p>
      )}
      <p className="mt-auto pt-5 text-xs uppercase tracking-wider text-bleu-800/50">
        {formaterDateCourte(article.publie_le ?? article.cree_le)}
        {article.auteur ? ` · ${article.auteur}` : ""}
      </p>
    </Carte>
  );
}
