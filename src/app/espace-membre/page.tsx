import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck, ShieldCheck, Wallet } from "lucide-react";

import { Badge, Bouton, Conteneur, EtatVide } from "@/components/ui/primitives";
import { FormulaireProfil } from "@/components/forms/formulaires-auth";
import { seDeconnecter } from "@/lib/actions/auth";
import { listerCotisations, listerMesInscriptions } from "@/lib/donnees";
import { formaterDate, formaterDateCourte, formaterMontant } from "@/lib/format";
import { profilCourant } from "@/lib/supabase/server";
import { TYPES_MEMBRES } from "@/content/organisation";

export const metadata: Metadata = {
  title: "Mon espace",
  description: "Espace personnel des membres de l'ONG A.J.MOND-CI.",
};

const LIBELLES_STATUT: Record<string, string> = {
  a_payer: "À payer",
  payee: "Payée",
  en_retard: "En retard",
};

const LIBELLES_NATURE: Record<string, string> = {
  adhesion: "Droit d'adhésion",
  mensuelle: "Cotisation mensuelle",
  exceptionnelle: "Cotisation exceptionnelle",
  don: "Don",
};

export default async function PageEspaceMembre() {
  const profil = await profilCourant();
  if (!profil) redirect("/connexion?suite=/espace-membre");

  const [cotisations, inscriptions] = await Promise.all([
    listerCotisations(profil.id),
    listerMesInscriptions(profil.id),
  ]);

  const restantDu = cotisations
    .filter((c) => c.statut !== "payee")
    .reduce((total, c) => total + c.montant, 0);

  const typeMembre =
    TYPES_MEMBRES.find((t) => t.cle === profil.type_membre)?.nom ?? profil.type_membre;

  return (
    <Conteneur className="py-12 lg:py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-bleu-800/60">Bonjour</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-bleu-900">
            {profil.prenoms} {profil.nom}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge ton="bleu">{typeMembre}</Badge>
            {profil.role === "admin" && <Badge ton="brique">Administrateur</Badge>}
            <Badge ton="neutre">Membre depuis le {formaterDateCourte(profil.date_adhesion)}</Badge>
          </div>
        </div>

        <div className="flex gap-3">
          {profil.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-bleu-200 px-5 py-2.5 text-sm font-semibold text-bleu-700 hover:bg-bleu-50"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Administration
            </Link>
          )}
          <form action={seDeconnecter}>
            <Bouton variante="secondaire">Se déconnecter</Bouton>
          </form>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-bleu-100 bg-sable-50/70 p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bleu-800/55">
            <Wallet className="h-4 w-4" aria-hidden />
            Restant dû
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-bleu-900">
            {formaterMontant(restantDu)}
          </p>
        </div>
        <div className="rounded-2xl border border-bleu-100 bg-sable-50/70 p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bleu-800/55">
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Inscriptions
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-bleu-900">{inscriptions.length}</p>
        </div>
        <div className="rounded-2xl border border-bleu-100 bg-sable-50/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-bleu-800/55">
            Cotisations enregistrées
          </p>
          <p className="mt-3 font-display text-3xl font-bold text-bleu-900">{cotisations.length}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <h2 className="font-display text-xl font-semibold text-bleu-900">Mes cotisations</h2>

          <div className="mt-5">
            {cotisations.length ? (
              <div className="overflow-x-auto rounded-2xl border border-bleu-100">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <thead className="bg-sable-50 text-xs uppercase tracking-widest text-bleu-800/55">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-semibold">Nature</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Période</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Montant</th>
                      <th scope="col" className="px-5 py-3 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bleu-100">
                    {cotisations.map((cotisation) => (
                      <tr key={cotisation.id}>
                        <td className="px-5 py-3.5 text-bleu-900">
                          {LIBELLES_NATURE[cotisation.nature] ?? cotisation.nature}
                        </td>
                        <td className="px-5 py-3.5 text-bleu-800/70">{cotisation.periode ?? "—"}</td>
                        <td className="px-5 py-3.5 font-medium text-bleu-900">
                          {formaterMontant(cotisation.montant)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            ton={
                              cotisation.statut === "payee"
                                ? "vert"
                                : cotisation.statut === "en_retard"
                                  ? "brique"
                                  : "neutre"
                            }
                          >
                            {LIBELLES_STATUT[cotisation.statut] ?? cotisation.statut}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EtatVide
                titre="Aucune cotisation enregistrée"
                texte="La Trésorerie Générale enregistre les cotisations depuis l'espace d'administration."
              />
            )}
          </div>

          <h2 className="mt-12 font-display text-xl font-semibold text-bleu-900">
            Mes inscriptions
          </h2>

          <div className="mt-5">
            {inscriptions.length ? (
              <ul className="space-y-3">
                {inscriptions.map((inscription) => (
                  <li
                    key={inscription.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-bleu-100 bg-white p-5"
                  >
                    <div>
                      <p className="font-medium text-bleu-900">
                        {inscription.evenement ? (
                          <Link
                            href={`/evenements/${inscription.evenement.slug}`}
                            className="lien-souligne"
                          >
                            {inscription.evenement.titre}
                          </Link>
                        ) : (
                          "Événement supprimé"
                        )}
                      </p>
                      {inscription.evenement && (
                        <p className="mt-1 text-xs text-bleu-800/60">
                          {formaterDate(inscription.evenement.debut_le)}
                          {inscription.evenement.ville ? ` · ${inscription.evenement.ville}` : ""}
                        </p>
                      )}
                    </div>
                    <Badge ton={inscription.statut === "acceptee" ? "vert" : "neutre"}>
                      {inscription.statut === "acceptee" ? "Confirmée" : "Enregistrée"}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EtatVide
                titre="Aucune inscription"
                texte="Inscrivez-vous à un forum depuis l'agenda pour le retrouver ici."
              />
            )}
          </div>
        </section>

        <section className="lg:col-span-5">
          <h2 className="font-display text-xl font-semibold text-bleu-900">Mon profil</h2>
          <p className="mt-1.5 text-sm text-bleu-800/70">{profil.email}</p>

          <div className="mt-5 rounded-2xl border border-bleu-100 bg-white p-6 shadow-sm">
            <FormulaireProfil profil={profil} />
          </div>
        </section>
      </div>
    </Conteneur>
  );
}
