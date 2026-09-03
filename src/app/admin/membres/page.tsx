import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Badge, EtatVide, cn } from "@/components/ui/primitives";
import { FormulaireCotisation } from "@/components/forms/formulaires-admin";
import { formaterDateCourte, formaterMontant } from "@/lib/format";
import { supprimerCotisation } from "@/lib/actions/admin";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Cotisation, Profil } from "@/lib/supabase/types";

const LIBELLES_NATURE: Record<string, string> = {
  adhesion: "Droit d'adhésion",
  mensuelle: "Mensuelle",
  exceptionnelle: "Exceptionnelle",
  don: "Don",
};

const LIBELLES_STATUT_COTISATION: Record<string, string> = {
  a_payer: "À payer",
  payee: "Payée",
  en_retard: "En retard",
};

export default async function PageAdminMembres({
  searchParams,
}: {
  searchParams: Promise<{ edition?: string }>;
}) {
  const { edition } = await searchParams;
  const supabase = await creerClientServeur();

  const [{ data: profilsBruts }, { data: cotisationsBrutes }] = await Promise.all([
    supabase
      ? supabase.from("profils").select("*").order("cree_le", { ascending: false })
      : Promise.resolve({ data: null }),
    supabase
      ? supabase.from("cotisations").select("*")
      : Promise.resolve({ data: null }),
  ]);

  const membres = (profilsBruts ?? []) as Profil[];
  const cotisations = (cotisationsBrutes ?? []) as Cotisation[];
  const enEdition = edition ? (cotisations.find((c) => c.id === edition) ?? null) : null;

  const nomDuMembre = new Map(
    membres.map((membre) => [
      membre.id,
      [membre.prenoms, membre.nom].filter(Boolean).join(" ") || membre.email,
    ]),
  );

  // La plus récente en tête : c'est celle qu'on vient de saisir, donc
  // celle qu'on corrige le plus souvent.
  const cotisationsRecentes = [...cotisations].sort((a, b) =>
    b.cree_le.localeCompare(a.cree_le),
  );

  const totalParMembre = new Map<string, number>();
  for (const cotisation of cotisations) {
    if (cotisation.statut === "payee") {
      totalParMembre.set(
        cotisation.profil_id,
        (totalParMembre.get(cotisation.profil_id) ?? 0) + cotisation.montant,
      );
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Membres ({membres.length})
        </h2>

        <div className="mt-6">
          {membres.length ? (
            <div className="overflow-x-auto rounded-2xl border border-bleu-100 bg-white">
              <table className="w-full min-w-[38rem] text-left text-sm">
                <thead className="bg-sable-50 text-xs uppercase tracking-widest text-bleu-800/55">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Membre</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Cotisé</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Depuis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bleu-100">
                  {membres.map((membre) => (
                    <tr key={membre.id}>
                      <td className="px-5 py-3.5">
                        <span className="block font-medium text-bleu-900">
                          {membre.prenoms} {membre.nom}
                        </span>
                        <span className="block text-xs text-bleu-800/60">{membre.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge ton={membre.role === "admin" ? "brique" : "neutre"}>
                          {membre.role === "admin" ? "Administrateur" : membre.type_membre}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-bleu-900">
                        {formaterMontant(totalParMembre.get(membre.id) ?? 0)}
                      </td>
                      <td className="px-5 py-3.5 text-bleu-800/70">
                        {formaterDateCourte(membre.date_adhesion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EtatVide
              titre="Aucun membre inscrit"
              texte="Les comptes créés depuis la page « Créer un compte » apparaîtront ici."
            />
          )}
        </div>
      </section>

      <section className="lg:col-span-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-bleu-900">
            {enEdition ? "Corriger une cotisation" : "Enregistrer une cotisation"}
          </h2>
          {enEdition && (
            <Link
              href="/admin/membres"
              className="inline-flex items-center gap-1.5 rounded-full bg-bleu-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-bleu-800"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Nouvelle
            </Link>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-craie-300 bg-white p-6">
          {membres.length ? (
            <FormulaireCotisation
              key={enEdition?.id ?? "nouvelle"}
              cotisation={enEdition}
              membres={membres.map((membre) => ({
                id: membre.id,
                libelle: `${membre.prenoms} ${membre.nom}`,
              }))}
            />
          ) : (
            <p className="text-sm text-bleu-800/70">
              Aucun membre à créditer pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="lg:col-span-12">
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Cotisations enregistrées ({cotisations.length})
        </h2>

        <div className="mt-6">
          {cotisationsRecentes.length ? (
            <div className="overflow-x-auto rounded-2xl border border-craie-300 bg-white">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="bg-craie-50 text-xs uppercase tracking-[0.12em] text-bleu-800/55">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Membre</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Nature</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Période</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Montant</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Statut</th>
                    <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-craie-200">
                  {cotisationsRecentes.map((cotisation) => {
                    const actif = enEdition?.id === cotisation.id;
                    return (
                      <tr
                        key={cotisation.id}
                        className={cn(
                          "transition-colors",
                          actif ? "bg-bleu-50/60" : "hover:bg-craie-50",
                        )}
                      >
                        <td className="px-5 py-4 font-medium text-bleu-900 sm:px-6">
                          {nomDuMembre.get(cotisation.profil_id) ?? "\u2014"}
                        </td>
                        <td className="px-5 py-4 text-bleu-800/75">
                          {LIBELLES_NATURE[cotisation.nature] ?? cotisation.nature}
                        </td>
                        <td className="chiffres px-5 py-4 text-bleu-800/75">
                          {cotisation.periode ?? "\u2014"}
                        </td>
                        <td className="chiffres px-5 py-4 font-medium text-bleu-900">
                          {formaterMontant(cotisation.montant)}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            ton={
                              cotisation.statut === "payee"
                                ? "vert"
                                : cotisation.statut === "en_retard"
                                  ? "brique"
                                  : "neutre"
                            }
                          >
                            {LIBELLES_STATUT_COTISATION[cotisation.statut] ?? cotisation.statut}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={
                                actif
                                  ? "/admin/membres"
                                  : `/admin/membres?edition=${cotisation.id}`
                              }
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                                actif
                                  ? "bg-bleu-900 text-white hover:bg-bleu-800"
                                  : "border border-craie-300 text-bleu-800 hover:border-bleu-300",
                              )}
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              {actif ? "En cours" : "Corriger"}
                            </Link>

                            <form action={supprimerCotisation}>
                              <input type="hidden" name="id" value={cotisation.id} />
                              <button
                                type="submit"
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brique-600 transition-colors hover:bg-brique-50"
                              >
                                Supprimer
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EtatVide
              titre="Aucune cotisation"
              texte="Enregistrez la première cotisation avec le formulaire ci-dessus. Elle alimentera la courbe du tableau de bord."
            />
          )}
        </div>
      </section>
    </div>
  );
}
