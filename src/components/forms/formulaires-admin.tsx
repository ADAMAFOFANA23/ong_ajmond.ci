"use client";

import { useActionState } from "react";

import {
  enregistrerArticle,
  enregistrerContenus,
  enregistrerCotisation,
  enregistrerEvenement,
  enregistrerMedia,
} from "@/lib/actions/admin";
import { CHAMPS_CONTENU, GROUPES_CONTENU } from "@/lib/contenus";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, CaseACocher, Champ, Selecteur, Zone } from "./champs";
import { ChampImage } from "./champ-image";
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

      <ChampImage
        nom="image_url"
        label="Visuel de l'événement"
        dossier="evenements"
        aide="Facultatif. Sans image, un visuel dérivé de l'identifiant est utilisé."
      />

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

      <ChampImage
        nom="couverture_url"
        label="Image de couverture"
        dossier="articles"
        aide="Facultatif. Elle illustre la carte de l'article et l'en-tête de la page."
      />

      <CaseACocher nom="publie" erreurs={etat.erreurs} defaultChecked>
        Publier immédiatement
      </CaseACocher>

      <BoutonEnvoi>Enregistrer l&apos;article</BoutonEnvoi>
    </form>
  );
}

/**
 * Mois courant au format « AAAA-MM », celui qu'attend `<input type="month">`.
 * La Côte d'Ivoire est à UTC+0 : la date UTC et la date locale coïncident,
 * serveur et navigateur calculent donc la même valeur.
 */
function periodeCourante(): string {
  return new Date().toISOString().slice(0, 7);
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
            // Le champ s'appelle déjà « Nature » : répéter « Cotisation » dans
            // chaque libellé les faisait dépasser de la colonne.
            { valeur: "mensuelle", libelle: "Mensuelle" },
            { valeur: "adhesion", libelle: "Droit d'adhésion" },
            { valeur: "exceptionnelle", libelle: "Exceptionnelle" },
            { valeur: "don", libelle: "Don" },
          ]}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="periode"
          label="Période"
          type="month"
          defaultValue={periodeCourante()}
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

export function FormulaireMedia({
  evenements,
}: {
  evenements: Array<{ id: string; titre: string }>;
}) {
  const [etat, action] = useActionState(enregistrerMedia, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <ChampImage
        nom="url"
        label="Photo"
        dossier="galerie"
        aide="Obligatoire. JPEG, PNG, WebP ou AVIF, 5 Mo maximum."
      />

      <Champ nom="titre" label="Titre" required erreurs={etat.erreurs} />
      <Champ nom="legende" label="Légende" erreurs={etat.erreurs} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="lieu" label="Lieu" erreurs={etat.erreurs} />
        <Champ nom="prise_le" label="Prise le" type="date" erreurs={etat.erreurs} />
      </div>

      <Selecteur
        nom="evenement_id"
        label="Rattacher à un événement"
        options={[
          { valeur: "", libelle: "Aucun" },
          ...evenements.map((evenement) => ({
            valeur: evenement.id,
            libelle: evenement.titre,
          })),
        ]}
        erreurs={etat.erreurs}
      />

      <CaseACocher nom="publie" erreurs={etat.erreurs} defaultChecked>
        Afficher dans la galerie publique
      </CaseACocher>

      <BoutonEnvoi>Ajouter la photo</BoutonEnvoi>
    </form>
  );
}

/**
 * Édition des contenus du site.
 *
 * Le formulaire se construit depuis le registre `CHAMPS_CONTENU` : aucune
 * liste de champs n'est recopiée ici, donc ajouter un contenu éditable ne
 * demande pas de retoucher cet écran.
 */
export function FormulaireContenus({ valeurs }: { valeurs: Record<string, string> }) {
  const [etat, action] = useActionState(enregistrerContenus, ETAT_INITIAL);

  return (
    <form action={action} className="space-y-10" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      {GROUPES_CONTENU.map((groupe) => (
        <section key={groupe}>
          <h3 className="border-b border-craie-200 pb-3 text-sm font-semibold uppercase tracking-[0.12em] text-bleu-800/55">
            {groupe}
          </h3>

          <div className="mt-6 space-y-5">
            {CHAMPS_CONTENU.filter((champ) => champ.groupe === groupe).map((champ) => {
              if (champ.type === "image") {
                return (
                  <ChampImage
                    key={champ.cle}
                    nom={champ.cle}
                    label={champ.label}
                    dossier="site"
                    aide={champ.aide}
                    valeurInitiale={valeurs[champ.cle]}
                  />
                );
              }

              if (champ.type === "long") {
                return (
                  <Zone
                    key={champ.cle}
                    nom={champ.cle}
                    label={champ.label}
                    rows={4}
                    aide={champ.aide}
                    defaultValue={valeurs[champ.cle]}
                    erreurs={etat.erreurs}
                  />
                );
              }

              return (
                <Champ
                  key={champ.cle}
                  nom={champ.cle}
                  label={champ.label}
                  aide={champ.aide}
                  defaultValue={valeurs[champ.cle]}
                  erreurs={etat.erreurs}
                />
              );
            })}
          </div>
        </section>
      ))}

      <BoutonEnvoi>Enregistrer les contenus</BoutonEnvoi>
    </form>
  );
}
