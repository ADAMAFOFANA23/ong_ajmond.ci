import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { EtatVide } from "@/components/ui/primitives";
import { formaterDateCourte } from "@/lib/format";
import { sectionsDe, type Section } from "@/lib/roles";
import { creerClientServeur, profilCourant } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Recherche" };

type Resultat = { id: string; titre: string; detail: string; href: string };

/**
 * Recherche transversale de l'espace de gestion.
 *
 * Chaque famille n'est interrogée que si le rôle y a accès : la recherche ne
 * doit pas révéler l'existence d'une demande d'adhésion à la trésorerie.
 */
export default async function PageAdminRecherche({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const terme = (q ?? "").trim();

  const [supabase, moi] = await Promise.all([creerClientServeur(), profilCourant()]);
  const sections = sectionsDe(moi?.role);
  const voit = (section: Section) => sections.includes(section);

  const familles: Array<{ titre: string; resultats: Resultat[] }> = [];

  if (supabase && terme.length >= 2) {
    const motif = `%${terme}%`;

    if (voit("membres")) {
      const { data } = await supabase
        .from("profils")
        .select("id, nom, prenoms, email, role")
        .or(`nom.ilike.${motif},prenoms.ilike.${motif},email.ilike.${motif}`)
        .limit(8);

      familles.push({
        titre: "Membres",
        resultats: (data ?? []).map((ligne) => ({
          id: ligne.id,
          titre: [ligne.prenoms, ligne.nom].filter(Boolean).join(" ") || ligne.email,
          detail: ligne.email,
          href: "/admin/membres",
        })),
      });
    }

    if (voit("adhesions")) {
      const { data } = await supabase
        .from("demandes_adhesion")
        .select("id, nom, prenoms, email, statut, cree_le")
        .or(`nom.ilike.${motif},prenoms.ilike.${motif},email.ilike.${motif}`)
        .limit(8);

      familles.push({
        titre: "Demandes d'adhésion",
        resultats: (data ?? []).map((ligne) => ({
          id: ligne.id,
          titre: `${ligne.prenoms} ${ligne.nom}`,
          detail: `${ligne.statut} · reçue le ${formaterDateCourte(ligne.cree_le)}`,
          href: "/admin/adhesions",
        })),
      });
    }

    if (voit("evenements")) {
      const { data } = await supabase
        .from("evenements")
        .select("id, slug, titre, etablissement, debut_le")
        .or(`titre.ilike.${motif},etablissement.ilike.${motif}`)
        .limit(8);

      familles.push({
        titre: "Événements",
        resultats: (data ?? []).map((ligne) => ({
          id: ligne.id,
          titre: ligne.titre,
          detail: [ligne.etablissement, formaterDateCourte(ligne.debut_le)]
            .filter(Boolean)
            .join(" · "),
          href: "/admin/evenements",
        })),
      });
    }

    if (voit("articles")) {
      const { data } = await supabase
        .from("articles")
        .select("id, slug, titre, categorie, publie")
        .or(`titre.ilike.${motif},categorie.ilike.${motif}`)
        .limit(8);

      familles.push({
        titre: "Actualités",
        resultats: (data ?? []).map((ligne) => ({
          id: ligne.id,
          titre: ligne.titre,
          detail: `${ligne.categorie} · ${ligne.publie ? "publié" : "brouillon"}`,
          href: "/admin/articles",
        })),
      });
    }
  }

  const total = familles.reduce((somme, famille) => somme + famille.resultats.length, 0);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-bleu-900">
          {terme ? <>Résultats pour «&nbsp;{terme}&nbsp;»</> : "Recherche"}
        </h2>
        <p className="mt-2 text-sm text-bleu-800/65">
          {terme.length >= 2
            ? `${total} résultat${total > 1 ? "s" : ""} dans les sections auxquelles vous avez accès.`
            : "Saisissez au moins deux caractères dans la barre de recherche."}
        </p>
      </div>

      {terme.length >= 2 && total === 0 && (
        <EtatVide
          titre="Aucun résultat"
          texte="Vérifiez l'orthographe, ou cherchez sur une partie du nom seulement."
        />
      )}

      {familles
        .filter((famille) => famille.resultats.length > 0)
        .map((famille) => (
          <section key={famille.titre} className="rounded-2xl border border-craie-300 bg-white">
            <h3 className="border-b border-craie-200 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-bleu-800/55 sm:px-6">
              {famille.titre}
            </h3>
            <ul className="divide-y divide-craie-200">
              {famille.resultats.map((resultat) => (
                <li key={resultat.id}>
                  <Link
                    href={resultat.href}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-craie-50 sm:px-6"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-bleu-900">{resultat.titre}</span>
                      <span className="block truncate text-xs text-bleu-800/60">
                        {resultat.detail}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-bleu-800/35" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
