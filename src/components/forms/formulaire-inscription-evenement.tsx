"use client";

import { useActionState } from "react";

import { sInscrireEvenement } from "@/lib/actions/public";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, Champ, Selecteur } from "./champs";
import { Message } from "@/components/ui/primitives";

const QUALITES = [
  { valeur: "eleve", libelle: "Élève" },
  { valeur: "encadreur", libelle: "Encadreur / personnel éducatif" },
  { valeur: "parent", libelle: "Parent d'élève" },
  { valeur: "partenaire", libelle: "Partenaire / institution" },
  { valeur: "autre", libelle: "Autre" },
];

export function FormulaireInscriptionEvenement({
  evenementId,
  slug,
  etablissement,
}: {
  evenementId: string;
  slug: string;
  etablissement?: string | null;
}) {
  const [etat, action] = useActionState(sInscrireEvenement, ETAT_INITIAL);

  if (etat.statut === "succes") {
    return <Message ton="succes">{etat.message}</Message>;
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="evenement_id" value={evenementId} />
      <input type="hidden" name="slug" value={slug} />

      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ nom="nom" label="Nom" required erreurs={etat.erreurs} />
        <Champ nom="prenoms" label="Prénoms" required erreurs={etat.erreurs} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ nom="email" label="Adresse e-mail" type="email" required erreurs={etat.erreurs} />
        <Champ nom="telephone" label="Téléphone" type="tel" erreurs={etat.erreurs} />
      </div>

      <Selecteur
        nom="qualite"
        label="Vous participez en tant que"
        options={QUALITES}
        defaultValue="eleve"
        erreurs={etat.erreurs}
      />

      <Champ
        nom="etablissement"
        label="Établissement"
        defaultValue={etablissement ?? ""}
        erreurs={etat.erreurs}
      />

      <BoutonEnvoi variante="accent" className="w-full">
        Je m&apos;inscris
      </BoutonEnvoi>
    </form>
  );
}
