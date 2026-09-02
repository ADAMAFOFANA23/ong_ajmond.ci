import { Badge, EtatVide } from "@/components/ui/primitives";
import { FormulaireCotisation } from "@/components/forms/formulaires-admin";
import { formaterDateCourte, formaterMontant } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { Cotisation, Profil } from "@/lib/supabase/types";

export default async function PageAdminMembres() {
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
        <h2 className="font-display text-xl font-semibold text-bleu-900">
          Enregistrer une cotisation
        </h2>
        <div className="mt-6 rounded-2xl border border-bleu-100 bg-white p-6">
          {membres.length ? (
            <FormulaireCotisation
              membres={membres.map((membre) => ({
                id: membre.id,
                libelle: `${membre.prenoms} ${membre.nom} — ${membre.email}`,
              }))}
            />
          ) : (
            <p className="text-sm text-bleu-800/70">
              Aucun membre à créditer pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
