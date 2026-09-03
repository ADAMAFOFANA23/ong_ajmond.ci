import Link from "next/link";
import { ArrowUpRight, Coins, MessageSquare, Plus, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  GraphiqueCotisations,
  type PointCotisation,
} from "@/components/admin/graphique-cotisations";
import { Badge, EtatVide, cn } from "@/components/ui/primitives";
import { formaterDateCourte, formaterMontant, formaterPlage } from "@/lib/format";
import { sectionsDe, type Section } from "@/lib/roles";
import { creerClientServeur, profilCourant } from "@/lib/supabase/server";

async function compter(table: string, filtre?: { colonne: string; valeur: unknown }) {
  const supabase = await creerClientServeur();
  if (!supabase) return 0;

  let requete = supabase.from(table).select("*", { count: "exact", head: true });
  if (filtre) requete = requete.eq(filtre.colonne, filtre.valeur);

  const { count } = await requete;
  return count ?? 0;
}

/** Douze derniers mois, du plus ancien au mois courant. */
function douzeMois(): PointCotisation[] {
  const maintenant = new Date();
  const mois: PointCotisation[] = [];

  for (let recul = 11; recul >= 0; recul -= 1) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - recul, 1);
    mois.push({
      mois: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      libelle: new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" }).format(date),
      total: 0,
    });
  }

  return mois;
}

const LIBELLES_STATUT: Record<string, string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

type Indicateur = {
  libelle: string;
  valeur: string;
  detail: string;
  href: string;
  icone: LucideIcon;
  section: Section;
  accent: boolean;
};

export default async function PageAdmin() {
  const supabase = await creerClientServeur();

  // Le tableau de bord ne montre que ce que le rôle peut réellement lire :
  // afficher « 0 demande » à qui n'a pas accès aux adhésions serait faux.
  const moi = await profilCourant();
  const sections = sectionsDe(moi?.role);
  const voit = (section: Section) => sections.includes(section);

  const [demandes, demandesNouvelles, membres, inscriptions, messagesNonTraites] =
    await Promise.all([
      compter("demandes_adhesion"),
      compter("demandes_adhesion", { colonne: "statut", valeur: "nouvelle" }),
      compter("profils"),
      compter("inscriptions"),
      compter("messages", { colonne: "traite", valeur: false }),
    ]);

  const serie = douzeMois();
  const debutSerie = `${serie[0].mois}-01`;

  const [{ data: cotisations }, { data: dernieresDemandes }, { data: prochains }] =
    await Promise.all([
      supabase
        ? supabase
            .from("cotisations")
            .select("montant, paye_le")
            .eq("statut", "payee")
            .gte("paye_le", debutSerie)
        : Promise.resolve({ data: null }),
      supabase
        ? supabase
            .from("demandes_adhesion")
            .select("id, nom, prenoms, email, ville, statut, cree_le")
            .order("cree_le", { ascending: false })
            .limit(6)
        : Promise.resolve({ data: null }),
      supabase
        ? supabase
            .from("evenements")
            .select("id, slug, titre, lieu, debut_le")
            .gte("debut_le", new Date().toISOString())
            .order("debut_le", { ascending: true })
            .limit(3)
        : Promise.resolve({ data: null }),
    ]);

  for (const cotisation of cotisations ?? []) {
    const cle = String(cotisation.paye_le).slice(0, 7);
    const point = serie.find((p) => p.mois === cle);
    if (point) point.total += cotisation.montant ?? 0;
  }

  const encaisseMois = serie[serie.length - 1].total;
  const encaisseMoisPrecedent = serie[serie.length - 2]?.total ?? 0;
  const encaisseAnnee = serie.reduce((somme, point) => somme + point.total, 0);

  // Écart au mois précédent, calculé seulement quand il veut dire quelque chose.
  const ecart =
    encaisseMoisPrecedent > 0
      ? Math.round(((encaisseMois - encaisseMoisPrecedent) / encaisseMoisPrecedent) * 100)
      : null;

  const TOUS_INDICATEURS: Indicateur[] = [
    {
      libelle: "Demandes d'adhésion",
      valeur: String(demandes),
      detail: demandesNouvelles > 0 ? `${demandesNouvelles} à examiner` : "aucune en attente",
      href: "/admin/adhesions",
      icone: UserPlus,
      section: "adhesions",
      accent: demandesNouvelles > 0,
    },
    {
      libelle: "Membres inscrits",
      valeur: String(membres),
      detail: "comptes actifs",
      href: "/admin/membres",
      icone: Users,
      section: "membres",
      accent: false,
    },
    {
      libelle: "Encaissé ce mois",
      valeur: formaterMontant(encaisseMois),
      detail:
        ecart === null
          ? `${formaterMontant(encaisseAnnee)} sur douze mois`
          : `${ecart >= 0 ? "+" : ""}${ecart} % par rapport au mois précédent`,
      href: "/admin/membres",
      icone: Coins,
      section: "membres",
      accent: false,
    },
    {
      libelle: "Messages",
      valeur: String(messagesNonTraites),
      detail: messagesNonTraites > 0 ? "à traiter" : "tout est traité",
      href: "/admin/messages",
      icone: MessageSquare,
      section: "messages",
      accent: messagesNonTraites > 0,
    },
  ];

  const INDICATEURS = TOUS_INDICATEURS.filter((indicateur) => voit(indicateur.section));

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- Indicateurs */}
      {INDICATEURS.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {INDICATEURS.map((indicateur) => {
            const Icone = indicateur.icone;
            return (
              <li key={indicateur.libelle}>
                <Link
                  href={indicateur.href}
                  className={cn(
                    "group flex h-full flex-col justify-between gap-6 rounded-2xl p-5 transition-colors",
                    indicateur.accent
                      ? "bg-brique-500 text-white hover:bg-brique-600"
                      : "border border-craie-300 bg-white hover:border-bleu-300",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        indicateur.accent ? "text-white/85" : "text-bleu-800/60",
                      )}
                    >
                      {indicateur.libelle}
                    </p>
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        indicateur.accent ? "bg-white/20 text-white" : "bg-bleu-50 text-bleu-600",
                      )}
                    >
                      <Icone className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </span>
                  </div>

                  <div>
                    <p
                      className={cn(
                        "chiffres font-display text-3xl font-semibold leading-none",
                        indicateur.accent ? "text-white" : "text-bleu-900",
                      )}
                    >
                      {indicateur.valeur}
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-xs",
                        indicateur.accent ? "text-white/85" : "text-bleu-800/60",
                      )}
                    >
                      {indicateur.detail}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* ------------------------------------------------- Cotisations */}
        {voit("membres") && (
          <section className="rounded-2xl border border-craie-300 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-bleu-800/60">Cotisations encaissées</h2>
                <p className="chiffres mt-1.5 font-display text-2xl font-semibold text-bleu-900">
                  {formaterMontant(encaisseAnnee)}
                  {ecart !== null && (
                    <span
                      className={cn(
                        "ml-2 text-sm font-medium",
                        ecart >= 0 ? "text-emerald-600" : "text-brique-600",
                      )}
                    >
                      ({ecart >= 0 ? "+" : ""}
                      {ecart} %)
                    </span>
                  )}
                </p>
              </div>

              <p className="inline-flex items-center gap-2 text-xs text-bleu-800/60">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-brique-500" />
                Encaissé, douze derniers mois
              </p>
            </div>

            <div className="mt-6">
              <GraphiqueCotisations points={serie} />
            </div>
          </section>
        )}

        {/* --------------------------------------------------- Prochains */}
        {voit("evenements") && (
          <section className="rounded-2xl border border-craie-300 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-bleu-900">
                Prochaines dates
              </h2>
              <Link
                href="/admin/evenements"
                className="inline-flex items-center gap-1.5 rounded-full bg-bleu-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-bleu-800"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Ajouter
              </Link>
            </div>

            {prochains?.length ? (
              <ul className="mt-5 border-t border-craie-200">
                {prochains.map((evenement) => (
                  <li key={evenement.id} className="border-b border-craie-200 py-4">
                    <p className="font-medium leading-snug text-bleu-900">{evenement.titre}</p>
                    <p className="chiffres mt-1.5 text-xs text-bleu-800/60">
                      {formaterPlage(evenement.debut_le)}
                    </p>
                    {evenement.lieu && (
                      <p className="mt-0.5 text-xs text-bleu-800/60">{evenement.lieu}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5">
                <EtatVide
                  titre="Aucune date programmée"
                  texte="Créez un événement pour ouvrir les inscriptions et l'afficher sur le site public."
                />
              </div>
            )}

            <p className="chiffres mt-5 border-t border-craie-200 pt-4 text-xs text-bleu-800/55">
              {inscriptions} inscription{inscriptions > 1 ? "s" : ""} enregistrée
              {inscriptions > 1 ? "s" : ""} toutes éditions confondues
            </p>
          </section>
        )}
      </div>

      {/* ------------------------------------------------------- Demandes */}
      {voit("adhesions") && (
        <section className="overflow-hidden rounded-2xl border border-craie-300 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-craie-200 px-5 py-4 sm:px-6">
            <h2 className="font-display text-lg font-semibold text-bleu-900">
              Dernières demandes d&apos;adhésion
            </h2>
            <Link
              href="/admin/adhesions"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brique-600 hover:text-brique-700"
            >
              Tout voir
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {dernieresDemandes?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-craie-50 text-xs uppercase tracking-[0.12em] text-bleu-800/55">
                  <tr>
                    <th scope="col" className="w-12 px-5 py-3 font-semibold sm:px-6">
                      N°
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">Demandeur</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Ville</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Statut</th>
                    <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Reçue le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-craie-200">
                  {dernieresDemandes.map((demande, rang) => (
                    <tr key={demande.id} className="transition-colors hover:bg-craie-50">
                      <td className="chiffres px-5 py-4 text-bleu-800/45 sm:px-6">{rang + 1}</td>
                      <td className="px-5 py-4">
                        <span className="block font-medium text-bleu-900">
                          {demande.prenoms} {demande.nom}
                        </span>
                        <span className="block text-xs text-bleu-800/60">{demande.email}</span>
                      </td>
                      <td className="px-5 py-4 text-bleu-800/75">{demande.ville ?? "—"}</td>
                      <td className="px-5 py-4">
                        <Badge
                          ton={
                            demande.statut === "acceptee"
                              ? "vert"
                              : demande.statut === "refusee"
                                ? "brique"
                                : demande.statut === "nouvelle"
                                  ? "bleu"
                                  : "neutre"
                          }
                        >
                          {LIBELLES_STATUT[demande.statut] ?? demande.statut}
                        </Badge>
                      </td>
                      <td className="chiffres px-5 py-4 text-bleu-800/75 sm:px-6">
                        {formaterDateCourte(demande.cree_le)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <EtatVide
                titre="Aucune demande pour le moment"
                texte="Les demandes déposées depuis le formulaire public apparaîtront ici, la plus récente en tête."
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
