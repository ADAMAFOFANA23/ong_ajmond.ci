"use client";

import Link from "next/link";
import { useActionState } from "react";

import { envoyerDemandeAdhesion } from "@/lib/actions/public";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, CaseACocher, Champ, Selecteur, Zone } from "./champs";
import { Message } from "@/components/ui/primitives";

const TYPES = [
  { valeur: "actif", libelle: "Membre actif / adhérent" },
  { valeur: "bienfaiteur", libelle: "Membre bienfaiteur" },
  { valeur: "honneur", libelle: "Membre d'honneur (sur désignation du Bureau)" },
];

export function FormulaireAdhesion() {
  const [etat, action] = useActionState(envoyerDemandeAdhesion, ETAT_INITIAL);

  if (etat.statut === "succes") {
    return (
      <div className="space-y-4">
        <Message ton="succes">{etat.message}</Message>
        <Link href="/" className="text-sm font-semibold text-bleu-700 lien-souligne">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="email"
          label="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          erreurs={etat.erreurs}
        />
        <Champ
          nom="telephone"
          label="Téléphone"
          type="tel"
          required
          placeholder="07 00 00 00 00"
          autoComplete="tel"
          erreurs={etat.erreurs}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="profession" label="Profession" erreurs={etat.erreurs} />
        <Champ nom="ville" label="Ville" erreurs={etat.erreurs} />
      </div>

      <Selecteur
        nom="type_membre"
        label="Type d'adhésion souhaité"
        options={TYPES}
        defaultValue="actif"
        erreurs={etat.erreurs}
      />

      <Zone
        nom="motivation"
        label="Pourquoi souhaitez-vous rejoindre l'ONG ?"
        required
        aide="Quelques lignes suffisent : votre motivation, vos compétences, votre disponibilité."
        erreurs={etat.erreurs}
      />

      <CaseACocher nom="engagement" erreurs={etat.erreurs} required>
        Je déclare avoir pris connaissance des statuts et du règlement intérieur de l&apos;ONG
        A.J.MOND-CI et m&apos;engage à m&apos;acquitter du droit d&apos;adhésion de 5 000 FCFA puis de
        la cotisation mensuelle de 1 000 FCFA.
      </CaseACocher>

      <BoutonEnvoi variante="accent">Envoyer ma demande</BoutonEnvoi>
    </form>
  );
}
