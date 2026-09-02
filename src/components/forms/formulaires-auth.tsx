"use client";

import { useActionState } from "react";

import { creerCompte, mettreAJourProfil, seConnecter } from "@/lib/actions/auth";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, Champ } from "./champs";
import { Message } from "@/components/ui/primitives";
import type { Profil } from "@/lib/supabase/types";

export function FormulaireConnexion({ suite }: { suite?: string }) {
  const [etat, action] = useActionState(seConnecter, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="suite" value={suite ?? ""} />
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <Champ
        nom="email"
        label="Adresse e-mail"
        type="email"
        required
        autoComplete="email"
        erreurs={etat.erreurs}
      />
      <Champ
        nom="motDePasse"
        label="Mot de passe"
        type="password"
        required
        autoComplete="current-password"
        erreurs={etat.erreurs}
      />

      <BoutonEnvoi className="w-full">Se connecter</BoutonEnvoi>
    </form>
  );
}

export function FormulaireCreationCompte() {
  const [etat, action] = useActionState(creerCompte, ETAT_INITIAL);

  if (etat.statut === "succes") {
    return <Message ton="succes">{etat.message}</Message>;
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="nom" label="Nom" required autoComplete="family-name" erreurs={etat.erreurs} />
        <Champ
          nom="prenoms"
          label="Prénoms"
          required
          autoComplete="given-name"
          erreurs={etat.erreurs}
        />
      </div>

      <Champ
        nom="telephone"
        label="Téléphone"
        type="tel"
        required
        autoComplete="tel"
        erreurs={etat.erreurs}
      />
      <Champ
        nom="email"
        label="Adresse e-mail"
        type="email"
        required
        autoComplete="email"
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="motDePasse"
          label="Mot de passe"
          type="password"
          required
          autoComplete="new-password"
          aide="8 caractères minimum."
          erreurs={etat.erreurs}
        />
        <Champ
          nom="confirmation"
          label="Confirmation"
          type="password"
          required
          autoComplete="new-password"
          erreurs={etat.erreurs}
        />
      </div>

      <BoutonEnvoi className="w-full">Créer mon compte</BoutonEnvoi>
    </form>
  );
}

export function FormulaireProfil({ profil }: { profil: Profil }) {
  const [etat, action] = useActionState(mettreAJourProfil, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="nom" label="Nom" required defaultValue={profil.nom} erreurs={etat.erreurs} />
        <Champ
          nom="prenoms"
          label="Prénoms"
          required
          defaultValue={profil.prenoms}
          erreurs={etat.erreurs}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="telephone"
          label="Téléphone"
          type="tel"
          defaultValue={profil.telephone ?? ""}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="ville"
          label="Ville"
          defaultValue={profil.ville ?? ""}
          erreurs={etat.erreurs}
        />
      </div>

      <Champ
        nom="profession"
        label="Profession"
        defaultValue={profil.profession ?? ""}
        erreurs={etat.erreurs}
      />

      <BoutonEnvoi>Enregistrer</BoutonEnvoi>
    </form>
  );
}
