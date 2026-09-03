"use client";

import { useActionState } from "react";

import {
  enregistrerArticle,
  enregistrerContenus,
  enregistrerCotisation,
  enregistrerEvenement,
  enregistrerMedia,
  enregistrerPartenaire,
} from "@/lib/actions/admin";
import { CHAMPS_CONTENU, GROUPES_CONTENU } from "@/lib/contenus";
import type { Article, Evenement, Media, Partenaire } from "@/lib/supabase/types";
import { ETAT_INITIAL } from "@/lib/actions/etat";
import { BoutonEnvoi, CaseACocher, Champ, Selecteur, Zone } from "./champs";
import { ChampImage } from "./champ-image";
import { Message } from "@/components/ui/primitives";

/**
 * `datetime-local` attend « AAAA-MM-JJTHH:mm ». La base renvoie un horodatage
 * ISO complet ; la Côte d'Ivoire étant à UTC+0, le tronquer suffit.
 */
function pourChampDateHeure(valeur: string | null | undefined): string | undefined {
  return valeur ? valeur.slice(0, 16) : undefined;
}

export function FormulaireEvenement({ evenement }: { evenement?: Evenement | null }) {
  const [etat, action] = useActionState(enregistrerEvenement, ETAT_INITIAL);
  const edition = Boolean(evenement);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="slug"
          label="Identifiant (URL)"
          required
          readOnly={edition}
          placeholder="forum-lycee-x-2026"
          defaultValue={evenement?.slug}
          aide={
            edition
              ? "Verrouillé : le modifier créerait un doublon et casserait le lien public."
              : "Minuscules, chiffres et tirets. Un identifiant existant met l'événement à jour."
          }
          erreurs={etat.erreurs}
        />
        <Champ
          nom="titre"
          label="Titre"
          required
          defaultValue={evenement?.titre}
          erreurs={etat.erreurs}
        />
      </div>

      <Champ
        nom="chapo"
        label="Accroche"
        defaultValue={evenement?.chapo ?? ""}
        erreurs={etat.erreurs}
      />
      <Zone
        nom="description"
        label="Description"
        rows={4}
        defaultValue={evenement?.description ?? ""}
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Champ
          nom="etablissement"
          label="Établissement"
          defaultValue={evenement?.etablissement ?? ""}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="lieu"
          label="Lieu précis"
          defaultValue={evenement?.lieu ?? ""}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="ville"
          label="Ville"
          defaultValue={evenement?.ville ?? ""}
          erreurs={etat.erreurs}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Champ
          nom="debut_le"
          label="Début"
          type="datetime-local"
          required
          defaultValue={pourChampDateHeure(evenement?.debut_le)}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="fin_le"
          label="Fin"
          type="datetime-local"
          defaultValue={pourChampDateHeure(evenement?.fin_le)}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="capacite"
          label="Capacité"
          type="number"
          min={0}
          defaultValue={evenement?.capacite ?? ""}
          erreurs={etat.erreurs}
        />
      </div>

      <ChampImage
        nom="image_url"
        label="Visuel de l'événement"
        dossier="evenements"
        valeurInitiale={evenement?.image_url}
        aide="Facultatif. Sans image, un visuel dérivé de l'identifiant est utilisé."
      />

      <CaseACocher
        nom="publie"
        erreurs={etat.erreurs}
        defaultChecked={evenement ? evenement.publie : true}
      >
        Publier sur le site
      </CaseACocher>

      <BoutonEnvoi>
        {edition ? "Mettre à jour l'événement" : "Créer l'événement"}
      </BoutonEnvoi>
    </form>
  );
}

export function FormulaireArticle({ article }: { article?: Article | null }) {
  const [etat, action] = useActionState(enregistrerArticle, ETAT_INITIAL);
  const edition = Boolean(article);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="slug"
          label="Identifiant (URL)"
          required
          readOnly={edition}
          placeholder="retour-forum-cocody"
          defaultValue={article?.slug}
          aide={
            edition
              ? "Verrouillé : le modifier créerait un doublon et casserait le lien public."
              : undefined
          }
          erreurs={etat.erreurs}
        />
        <Champ
          nom="titre"
          label="Titre"
          required
          defaultValue={article?.titre}
          erreurs={etat.erreurs}
        />
      </div>

      <Champ
        nom="chapo"
        label="Chapô"
        defaultValue={article?.chapo ?? ""}
        erreurs={etat.erreurs}
      />

      <Zone
        nom="contenu"
        label="Contenu"
        required
        rows={10}
        aide="Un paragraphe par ligne."
        defaultValue={article?.contenu}
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="categorie"
          label="Catégorie"
          required
          defaultValue={article?.categorie ?? "Actualité"}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="auteur"
          label="Auteur"
          defaultValue={article?.auteur ?? ""}
          erreurs={etat.erreurs}
        />
      </div>

      <ChampImage
        nom="couverture_url"
        label="Image de couverture"
        dossier="articles"
        valeurInitiale={article?.couverture_url}
        aide="Facultatif. Elle illustre la carte de l'article et l'en-tête de la page."
      />

      <CaseACocher
        nom="publie"
        erreurs={etat.erreurs}
        defaultChecked={article ? article.publie : true}
      >
        Publier sur le site
      </CaseACocher>

      <BoutonEnvoi>{edition ? "Mettre à jour l'article" : "Créer l'article"}</BoutonEnvoi>
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
  media,
}: {
  evenements: Array<{ id: string; titre: string }>;
  media?: Media | null;
}) {
  const [etat, action] = useActionState(enregistrerMedia, ETAT_INITIAL);
  const edition = Boolean(media);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      {media && <input type="hidden" name="id" value={media.id} />}

      <ChampImage
        nom="url"
        label="Photo"
        dossier="galerie"
        valeurInitiale={media?.url}
        aide="Obligatoire. JPEG, PNG, WebP ou AVIF, 5 Mo maximum."
      />

      <Champ
        nom="titre"
        label="Titre"
        required
        defaultValue={media?.titre}
        erreurs={etat.erreurs}
      />
      <Champ
        nom="legende"
        label="Légende"
        defaultValue={media?.legende ?? ""}
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ nom="lieu" label="Lieu" defaultValue={media?.lieu ?? ""} erreurs={etat.erreurs} />
        <Champ
          nom="prise_le"
          label="Prise le"
          type="date"
          defaultValue={media?.prise_le ?? ""}
          erreurs={etat.erreurs}
        />
      </div>

      <Selecteur
        nom="evenement_id"
        label="Rattacher à un événement"
        defaultValue={media?.evenement_id ?? ""}
        options={[
          { valeur: "", libelle: "Aucun" },
          ...evenements.map((evenement) => ({
            valeur: evenement.id,
            libelle: evenement.titre,
          })),
        ]}
        erreurs={etat.erreurs}
      />

      <CaseACocher
        nom="publie"
        erreurs={etat.erreurs}
        defaultChecked={media ? media.publie : true}
      >
        Afficher dans la galerie publique
      </CaseACocher>

      <BoutonEnvoi>{edition ? "Mettre à jour la photo" : "Ajouter la photo"}</BoutonEnvoi>
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

const TYPES_PARTENAIRE = [
  { valeur: "etablissement", libelle: "Établissement scolaire" },
  { valeur: "technique", libelle: "Partenaire technique" },
  { valeur: "institutionnel", libelle: "Institution publique" },
  { valeur: "soutien", libelle: "Soutien ou bailleur" },
];

export function FormulairePartenaire({ partenaire }: { partenaire?: Partenaire | null }) {
  const [etat, action] = useActionState(enregistrerPartenaire, ETAT_INITIAL);
  const edition = Boolean(partenaire);

  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.statut === "succes" && <Message ton="succes">{etat.message}</Message>}
      {etat.statut === "erreur" && etat.message && <Message ton="erreur">{etat.message}</Message>}

      {partenaire && <input type="hidden" name="id" value={partenaire.id} />}

      <ChampImage
        nom="logo_url"
        label="Logo"
        dossier="partenaires"
        valeurInitiale={partenaire?.logo_url}
        aide="Facultatif. Un fond transparent (PNG ou WebP) rend le mieux."
      />

      <Champ
        nom="nom"
        label="Nom"
        required
        defaultValue={partenaire?.nom}
        aide="Il doit être unique : deux partenaires ne peuvent pas porter le même nom."
        erreurs={etat.erreurs}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Selecteur
          nom="type"
          label="Catégorie"
          defaultValue={partenaire?.type ?? "etablissement"}
          options={TYPES_PARTENAIRE}
          erreurs={etat.erreurs}
        />
        <Champ
          nom="ville"
          label="Ville"
          defaultValue={partenaire?.ville ?? ""}
          erreurs={etat.erreurs}
        />
      </div>

      <Champ
        nom="site_url"
        label="Site internet"
        type="url"
        placeholder="https://…"
        defaultValue={partenaire?.site_url ?? ""}
        erreurs={etat.erreurs}
      />

      <Zone
        nom="description"
        label="Description"
        rows={3}
        aide="Une phrase sur la nature du partenariat, facultative."
        defaultValue={partenaire?.description ?? ""}
        erreurs={etat.erreurs}
      />

      <Champ
        nom="ordre"
        label="Ordre d'affichage"
        type="number"
        min={0}
        max={999}
        defaultValue={partenaire?.ordre ?? 0}
        aide="Les plus petits nombres passent en premier, à catégorie égale."
        erreurs={etat.erreurs}
      />

      <CaseACocher
        nom="publie"
        erreurs={etat.erreurs}
        defaultChecked={partenaire ? partenaire.publie : true}
      >
        Afficher sur le site public
      </CaseACocher>

      <BoutonEnvoi>
        {edition ? "Mettre à jour le partenaire" : "Ajouter le partenaire"}
      </BoutonEnvoi>
    </form>
  );
}
