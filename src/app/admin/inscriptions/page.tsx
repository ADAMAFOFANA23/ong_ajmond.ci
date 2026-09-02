import { EtatVide } from "@/components/ui/primitives";
import { formaterDateCourte } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";

type LigneInscription = {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string | null;
  qualite: string | null;
  etablissement: string | null;
  cree_le: string;
  evenements: { titre: string; slug: string } | { titre: string; slug: string }[] | null;
};

export default async function PageAdminInscriptions() {
  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase
        .from("inscriptions")
        .select(
          "id, nom, prenoms, email, telephone, qualite, etablissement, cree_le, evenements ( titre, slug )",
        )
        .order("cree_le", { ascending: false })
    : { data: null };

  const inscriptions = ((data ?? []) as unknown as LigneInscription[]).map((ligne) => ({
    ...ligne,
    evenement: Array.isArray(ligne.evenements) ? (ligne.evenements[0] ?? null) : ligne.evenements,
  }));

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-bleu-900">
        Inscriptions ({inscriptions.length})
      </h2>

      <div className="mt-6">
        {inscriptions.length ? (
          <div className="overflow-x-auto rounded-2xl border border-bleu-100 bg-white">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-sable-50 text-xs uppercase tracking-widest text-bleu-800/55">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Participant</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Événement</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Qualité</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Établissement</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Reçue le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bleu-100">
                {inscriptions.map((inscription) => (
                  <tr key={inscription.id}>
                    <td className="px-5 py-3.5">
                      <span className="block font-medium text-bleu-900">
                        {inscription.prenoms} {inscription.nom}
                      </span>
                      <span className="block text-xs text-bleu-800/60">
                        {inscription.email}
                        {inscription.telephone ? ` · ${inscription.telephone}` : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-bleu-800/80">
                      {inscription.evenement?.titre ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-bleu-800/70">{inscription.qualite ?? "—"}</td>
                    <td className="px-5 py-3.5 text-bleu-800/70">
                      {inscription.etablissement ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-bleu-800/70">
                      {formaterDateCourte(inscription.cree_le)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EtatVide
            titre="Aucune inscription"
            texte="Les inscriptions déposées sur les pages d'événements apparaîtront ici."
          />
        )}
      </div>
    </div>
  );
}
