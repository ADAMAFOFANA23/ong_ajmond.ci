"use client";

import { useActionState } from "react";

import { enregistrerArticle, enregistrerCotisation, enregistrerEvenement } from "@/lib/actions/admin";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, CaseACocher, Champ, Selecteur, Zone } from "./champs";
import { Message } from "@/components/ui/primitives";

export function FormulaireEvenement() {
  const [etat, action] = useActionState(enregistrerEvenement, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="slug"
          label="Identifiant (URL)"
          required
          placeholder="forum-lycee-x-2026"
          aide="Minuscules, chiffres et tirets. Un identifiant existant met l'événement à jour."
          erreurs={etat.erreurs}
        />
        <Champ nom="titre" label="Titre" required erreurs={etat.erreurs} />
      </div>

      <Champ nom="chapo" label="Accroche" erreurs={etat.erreurs} />
      <Zone nom="description" label="Description" rows={4} erreurs={etat.erreurs} />

      <div className="grid gap-5 sm:grid-cols-3">
        <Champ nom="etablissement" label="Établissement" erreurs={etat.erreurs} />
        <Champ nom="lieu" label="Lieu précis" erreurs={etat.erreurs} />
        <Champ nom="ville" label="Ville" erreurs={etat.erreurs} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Champ
          nom="debut_le"
          label="Début"
          type="datetime-local"
          required
          erreurs={etat.erreurs}
        />
        <Champ nom="fin_le" label="Fin" type="datetime-local" erreurs={etat.erreurs} />
        <Champ nom="capacite" label="Capacité" type="number" min={0} erreurs={etat.erreurs} />
      </div>

      <CaseACocher nom="publie" erreurs={etat.erreurs} defaultChecked>
        Publier immédiatement sur le site
      </CaseACocher>

      <BoutonEnvoi>Enregistrer l&apos;événement</BoutonEnvoi>
    </form>
  );
}

export function FormulaireArticle() {
  const [etat, action] = useActionState(enregistrerArticle, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="slug"
          label="Identifiant (URL)"
          required
          placeholder="retour-forum-cocody"
          erreurs={etat.erreurs}
        />
        <Champ nom="titre" label="Titre" required erreurs={etat.erreurs} />
      </div>

      <Champ nom="chapo" label="Chapô" erreurs={etat.erreurs} />

      <Zone
        nom="contenu"
        label="Contenu"
        required
        rows={10}
        aide="Un paragraphe par ligne."
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="categorie"
          label="Catégorie"
          required
          defaultValue="Actualité"
          erreurs={etat.erreurs}
        />
        <Champ nom="auteur" label="Auteur" erreurs={etat.erreurs} />
      </div>

      <CaseACocher nom="publie" erreurs={etat.erreurs} defaultChecked>
        Publier immédiatement
      </CaseACocher>

      <BoutonEnvoi>Enregistrer l&apos;article</BoutonEnvoi>
    </form>
  );
}

export function FormulaireCotisation({
  membres,
}: {
  membres: Array<{ id: string; libelle: string }>;
}) {
  const [etat, action] = useActionState(enregistrerCotisation, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <Selecteur
        nom="profil_id"
        label="Membre"
        required
        options={membres.map((membre) => ({ valeur: membre.id, libelle: membre.libelle }))}
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Selecteur
          nom="nature"
          label="Nature"
          defaultValue="mensuelle"
          options={[
            { valeur: "mensuelle", libelle: "Cotisation mensuelle" },
            { valeur: "adhesion", libelle: "Droit d'adhésion" },
            { valeur: "exceptionnelle", libelle: "Cotisation exceptionnelle" },
            { valeur: "don", libelle: "Don" },
          ]}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="periode"
          label="Période"
          placeholder="2026-03"
          erreurs={etat.erreurs}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="montant"
          label="Montant (FCFA)"
          type="number"
          min={0}
          required
          defaultValue={1000}
          erreurs={etat.erreurs}
        />
        <Selecteur
          nom="statut"
          label="Statut"
          defaultValue="a_payer"
          options={[
            { valeur: "a_payer", libelle: "À payer" },
            { valeur: "payee", libelle: "Payée" },
            { valeur: "en_retard", libelle: "En retard" },
          ]}
          erreurs={etat.erreurs}
        />
      </div>

      <BoutonEnvoi>Enregistrer la cotisation</BoutonEnvoi>
    </form>
  );
}
