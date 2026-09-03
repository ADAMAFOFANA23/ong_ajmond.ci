import type { Metadata } from "next";

import { FormulaireRole } from "@/components/forms/formulaire-role";
import { Badge, EtatVide } from "@/components/ui/primitives";
import { formaterDateCourte } from "@/lib/format";
import { ROLES, ROLES_ATTRIBUABLES, type Role } from "@/lib/roles";
import { creerClientServeur, profilCourant } from "@/lib/supabase/server";
import type { Profil } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Rôles" };

const TONS: Record<Role, "brique" | "bleu" | "neutre" | "vert"> = {
  admin: "brique",
  secretariat: "bleu",
  tresorerie: "vert",
  communication: "bleu",
  membre: "neutre",
};

export default async function PageAdminRoles() {
  const [supabase, moi] = await Promise.all([creerClientServeur(), profilCourant()]);

  const { data } = supabase
    ? await supabase.from("profils").select("*").order("role").order("email")
    : { data: null };

  const membres = (data ?? []) as Profil[];

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-bleu-900">
          Qui peut faire quoi
        </h2>
        <p className="mt-3 leading-relaxed text-bleu-800/75">
          Chaque rôle n&apos;ouvre que les sections dont son organe a l&apos;usage. Le
          cloisonnement est appliqué par la base de données, pas seulement par cette
          interface : un rôle qui n&apos;a pas accès à une table ne peut pas la lire, même
          en appelant l&apos;API directement.
        </p>
      </div>

      {/* ---------------------------------------------------- Référentiel */}
      <section className="border border-craie-300 bg-white">
        <h3 className="border-b border-craie-200 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-bleu-800/55 sm:px-6">
          Les cinq rôles
        </h3>
        <dl className="divide-y divide-craie-200">
          {ROLES_ATTRIBUABLES.map((role) => (
            <div
              key={role}
              className="grid gap-2 px-5 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8 sm:px-6"
            >
              <dt>
                <span className="font-display text-base font-semibold text-bleu-900">
                  {ROLES[role].nom}
                </span>
                <span className="mt-0.5 block text-xs text-bleu-800/55">
                  {ROLES[role].organe}
                </span>
              </dt>
              <dd>
                <p className="max-w-[68ch] text-sm leading-relaxed text-bleu-800/75">
                  {ROLES[role].description}
                </p>
                {ROLES[role].sections.length > 0 && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {ROLES[role].sections.map((section) => (
                      <li
                        key={section}
                        className="rounded border border-craie-300 bg-craie-50 px-2 py-0.5 text-xs text-bleu-800/70"
                      >
                        {section.replace(/-/g, " ")}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* -------------------------------------------------------- Membres */}
      <section className="border border-craie-300 bg-white">
        <h3 className="border-b border-craie-200 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-bleu-800/55 sm:px-6">
          Attribution — {membres.length} compte{membres.length > 1 ? "s" : ""}
        </h3>

        {membres.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-craie-50 text-xs uppercase tracking-[0.12em] text-bleu-800/55">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Membre</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Rôle actuel</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Membre depuis</th>
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Attribuer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-craie-200">
                {membres.map((membre) => {
                  const role = (membre.role ?? "membre") as Role;
                  return (
                    <tr key={membre.id} className="align-top">
                      <td className="px-5 py-4 sm:px-6">
                        <span className="block font-medium text-bleu-900">
                          {[membre.prenoms, membre.nom].filter(Boolean).join(" ") || "—"}
                        </span>
                        <span className="block text-xs text-bleu-800/60">{membre.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge ton={TONS[role]}>{ROLES[role]?.nom ?? role}</Badge>
                        {!membre.actif && (
                          <span className="mt-1.5 block text-xs text-brique-600">
                            compte désactivé
                          </span>
                        )}
                      </td>
                      <td className="chiffres px-5 py-4 text-bleu-800/70">
                        {formaterDateCourte(membre.date_adhesion)}
                      </td>
                      <td className="px-5 py-4 sm:px-6">
                        <FormulaireRole
                          profilId={membre.id}
                          roleActuel={role}
                          estMoi={membre.id === moi?.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <EtatVide
              titre="Aucun compte à administrer"
              texte="Les comptes créés depuis « Créer un compte » apparaîtront ici, avec leur rôle."
            />
          </div>
        )}
      </section>
    </div>
  );
}
