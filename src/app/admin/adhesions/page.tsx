import { Badge, EtatVide } from "@/components/ui/primitives";
import { changerStatutDemande } from "@/lib/actions/admin";
import { formaterDateCourte } from "@/lib/format";
import { creerClientServeur } from "@/lib/supabase/server";
import type { DemandeAdhesion } from "@/lib/supabase/types";

const STATUTS = [
  { valeur: "nouvelle", libelle: "Nouvelle" },
  { valeur: "en_cours", libelle: "En cours" },
  { valeur: "acceptee", libelle: "Acceptée" },
  { valeur: "refusee", libelle: "Refusée" },
];

const TONS = {
  nouvelle: "brique",
  en_cours: "bleu",
  acceptee: "vert",
  refusee: "neutre",
} as const;

export default async function PageAdminAdhesions() {
  const supabase = await creerClientServeur();
  const { data } = supabase
    ? await supabase.from("demandes_adhesion").select("*").order("cree_le", { ascending: false })
    : { data: null };

  const demandes = (data ?? []) as DemandeAdhesion[];

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-bleu-900">
        Demandes d&apos;adhésion ({demandes.length})
      </h2>

      <div className="mt-6">
        {demandes.length ? (
          <ul className="space-y-4">
            {demandes.map((demande) => (
              <li key={demande.id} className="rounded-2xl border border-bleu-100 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold text-bleu-900">
                      {demande.prenoms} {demande.nom}
                    </p>
                    <p className="mt-1 text-sm text-bleu-800/70">
                      {demande.email} · {demande.telephone}
                    </p>
                    <p className="mt-1 text-xs text-bleu-800/55">
                      {[demande.profession, demande.ville].filter(Boolean).join(" · ")}
                      {demande.profession || demande.ville ? " · " : ""}
                      Reçue le {formaterDateCourte(demande.cree_le)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge ton={TONS[demande.statut]}>
                      {STATUTS.find((s) => s.valeur === demande.statut)?.libelle ?? demande.statut}
                    </Badge>
                    <Badge ton="neutre">{demande.type_membre}</Badge>
                  </div>
                </div>

                <p className="mt-4 rounded-xl bg-sable-50 p-4 text-sm leading-relaxed text-bleu-800/80">
                  {demande.motivation}
                </p>

                <form action={changerStatutDemande} className="mt-4 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={demande.id} />
                  <label htmlFor={`statut-${demande.id}`} className="text-xs font-medium text-bleu-800/70">
                    Changer le statut
                  </label>
                  <select
                    id={`statut-${demande.id}`}
                    name="statut"
                    defaultValue={demande.statut}
                    className="rounded-full border border-bleu-200 px-4 py-2 text-sm text-bleu-900"
                  >
                    {STATUTS.map((statut) => (
                      <option key={statut.valeur} value={statut.valeur}>
                        {statut.libelle}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-bleu-600 px-4 py-2 text-sm font-semibold text-white hover:bg-bleu-700"
                  >
                    Enregistrer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <EtatVide
            titre="Aucune demande"
            texte="Les demandes déposées depuis la page d'adhésion apparaîtront ici."
          />
        )}
      </div>
    </div>
  );
}
