"use client";

import { useActionState } from "react";

import { envoyerMessage } from "@/lib/actions/public";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, Champ, Zone } from "./champs";
import { Message } from "@/components/ui/primitives";

export function FormulaireContact() {
  const [etat, action] = useActionState(envoyerMessage, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="nom" label="Nom et prénoms" required autoComplete="name" erreurs={etat.erreurs} />
        <Champ
          nom="email"
          label="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          erreurs={etat.erreurs}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="telephone" label="Téléphone" type="tel" autoComplete="tel" erreurs={etat.erreurs} />
        <Champ nom="sujet" label="Sujet" required erreurs={etat.erreurs} />
      </div>

      <Zone nom="message" label="Votre message" required rows={6} erreurs={etat.erreurs} />

      <BoutonEnvoi>Envoyer le message</BoutonEnvoi>
    </form>
  );
}
