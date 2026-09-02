import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { EtatVide } from "@/components/ui/primitives";
import { creerClientServeur } from "@/lib/supabase/server";
import { formaterDateCourte } from "@/lib/format";

async function compter(table: string, filtre?: { colonne: string; valeur: unknown }) {
  const supabase = await creerClientServeur();
  if (!supabase) return 0;

  let requete = supabase.from(table).select("*", { count: "exact", head: true });
  if (filtre) requete = requete.eq(filtre.colonne, filtre.valeur);

  const { count } = await requete;
  return count ?? 0;
}

export default async function PageAdmin() {
  const supabase = await creerClientServeur();

  const [demandes, demandesNouvelles, membres, evenements, inscriptions, messages, messagesNonTraites] =
    await Promise.all([
      compter("demandes_adhesion"),
      compter("demandes_adhesion", { colonne: "statut", valeur: "nouvelle" }),
      compter("profils"),
      compter("evenements"),
      compter("inscriptions"),
      compter("messages"),
      compter("messages", { colonne: "traite", valeur: false }),
    ]);

  const { data: dernieresDemandes } = supabase
    ? await supabase
        .from("demandes_adhesion")
        .select("id, nom, prenoms, email, statut, cree_le")
        .order("cree_le", { ascending: false })
        .limit(5)
    : { data: null };

  const INDICATEURS = [
    { libelle: "Demandes d'adhésion", valeur: demandes, detail: `${demandesNouvelles} nouvelle(s)`, href: "/admin/adhesions" },
    { libelle: "Membres inscrits", valeur: membres, detail: "comptes actifs", href: "/admin/membres" },
    { libelle: "Événements", valeur: evenements, detail: "au catalogue", href: "/admin/evenements" },
    { libelle: "Inscriptions", valeur: inscriptions, detail: "toutes éditions", href: "/admin/inscriptions" },
    { libelle: "Messages", valeur: messages, detail: `${messagesNonTraites} à traiter`, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-10">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {INDICATEURS.map((indicateur) => (
          <li key={indicateur.libelle}>
            <Link
              href={indicateur.href}
              className="block h-full rounded-2xl border border-bleu-100 bg-white p-5 transition hover:border-bleu-300 hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-bleu-800/50">
                {indicateur.libelle}
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-bleu-900">
                {indicateur.valeur}
              </p>
              <p className="mt-1 text-xs text-bleu-800/60">{indicateur.detail}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            Dernières demandes d&apos;adhésion
          </h2>
          <Link
            href="/admin/adhesions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bleu-700 hover:text-bleu-800"
          >
            Tout voir
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-5">
          {dernieresDemandes?.length ? (
            <div className="overflow-x-auto rounded-2xl border border-bleu-100 bg-white">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-sable-50 text-xs uppercase tracking-widest text-bleu-800/55">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Nom</th>
                    <th scope="col" className="px-5 py-3 font-semibold">E-mail</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Statut</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Reçue le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bleu-100">
                  {dernieresDemandes.map((demande) => (
                    <tr key={demande.id}>
                      <td className="px-5 py-3.5 font-medium text-bleu-900">
                        {demande.prenoms} {demande.nom}
                      </td>
                      <td className="px-5 py-3.5 text-bleu-800/70">{demande.email}</td>
                      <td className="px-5 py-3.5 text-bleu-800/70">{demande.statut}</td>
                      <td className="px-5 py-3.5 text-bleu-800/70">
                        {formaterDateCourte(demande.cree_le)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EtatVide
              titre="Aucune demande pour le moment"
              texte="Les demandes déposées depuis le formulaire public apparaîtront ici."
            />
          )}
        </div>
      </section>
    </div>
  );
}
