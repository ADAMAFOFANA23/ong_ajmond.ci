"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

import { changerRole } from "@/lib/actions/admin";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { ROLES, ROLES_ATTRIBUABLES, type Role } from "@/lib/roles";
import { cn } from "@/components/ui/primitives";

function BoutonEnregistrer({ modifie }: { modifie: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!modifie || pending}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors",
        modifie
          ? "bg-bleu-900 text-white hover:bg-bleu-800"
          : "cursor-not-allowed bg-craie-200 text-bleu-800/40",
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Check className="h-4 w-4" aria-hidden />
      )}
      {pending ? "Envoi…" : "Appliquer"}
    </button>
  );
}

/**
 * Attribution du rôle d'un membre.
 *
 * Le bouton reste inerte tant que la sélection n'a pas changé : sur une liste
 * de lignes identiques, un bouton toujours actif invite à cliquer au hasard.
 */
export function FormulaireRole({
  profilId,
  roleActuel,
  estMoi,
}: {
  profilId: string;
  roleActuel: Role;
  estMoi: boolean;
}) {
  const [etat, action] = useActionState(changerRole, ETAT_INITIAL);
  const [choix, setChoix] = useState<string>(roleActuel);
  const identifiant = useId();

  if (estMoi) {
    return (
      <p className="text-sm text-bleu-800/60">
        {ROLES[roleActuel].nom}
        <span className="mt-0.5 block text-xs">
          Votre propre rôle — un autre administrateur doit le modifier.
        </span>
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="profil_id" value={profilId} />

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={identifiant} className="sr-only">
          Rôle attribué
        </label>
        <select
          id={identifiant}
          name="role"
          value={choix}
          onChange={(evenement) => setChoix(evenement.target.value)}
          className="h-10 min-w-[11rem] rounded-lg border border-craie-300 bg-white px-3 text-sm text-bleu-900 outline-none transition focus:border-bleu-500"
        >
          {ROLES_ATTRIBUABLES.map((role) => (
            <option key={role} value={role}>
              {ROLES[role].nom}
            </option>
          ))}
        </select>

        <BoutonEnregistrer modifie={choix !== roleActuel} />
      </div>

      {etat.statut !== "attente" && etat.message && (
        <p
          role="status"
          className={cn(
            "text-xs leading-snug",
            etat.statut === "succes" ? "text-emerald-700" : "text-brique-700",
          )}
        >
          {etat.message}
        </p>
      )}
    </form>
  );
}
