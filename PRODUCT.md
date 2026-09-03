# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quatre publics, confirmés par le commanditaire le 2026-09-02, qui se partagent la même page
d'accueil :

- **Parents** d'élèves du secondaire, inquiets d'un comportement ou cherchant à qui parler.
- **Membres et bénévoles**, actuels ou futurs, qui veulent s'engager, cotiser et suivre la vie
  statutaire de l'ONG.
- **Pouvoirs publics** — DREN, ministères, directions d'établissement — qui décident d'accueillir
  ou non une intervention.
- **Donateurs et partenaires** — bailleurs, entreprises, fondations, partenaires techniques.

Les **élèves de la 6e à la terminale** sont les bénéficiaires des actions, pas le public du site.

## Product Purpose

Site institutionnel et outil de gestion de l'ONG A.J.MOND-CI (Amie des Jeunes du Monde de Côte
d'Ivoire), créée en 2019 à Abidjan. L'ONG lutte contre les fléaux sociaux en milieu scolaire —
drogue, alcool, tabac, violences, vol, tricherie, prostitution — par la sensibilisation, l'écoute,
la formation des encadreurs et la réinsertion. Le site doit faire comprendre l'action, obtenir des
adhésions et des soutiens, et permettre au bureau de piloter l'activité.

## Positioning

L'ONG n'édite pas de contenu de prévention : elle se déplace dans les établissements avec des
psychologues et des chercheurs du CIERPA (UFR Cocody) et du département des sciences de
l'éducation. Le format signature est le **Forum d'échanges, d'écoute, de conseils et de
restauration** : une matinée complète dans un lycée, exposés puis ateliers puis restitution en
plénière, prolongée par des séances d'écoute individuelle. C'est cette présence physique et
pluridisciplinaire, adossée à la recherche universitaire et à la DREN, qu'un site de prévention
générique ne peut pas revendiquer.

## Operating Context

Interventions dans les lycées de la DREN Abidjan-1 et d'Adzopé, sur autorisation des directions.
Vie associative statutaire : Assemblée Générale, Bureau Exécutif, Trésorerie Générale,
Commissariat aux comptes, chargés de mission. Financement par droit d'adhésion, cotisations
mensuelles, cotisations exceptionnelles, dons et legs, subventions.

## Capabilities and Constraints

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Supabase (Auth + RLS, `@supabase/ssr`),
Zod, Server Actions. Pas d'ORM. `middleware.ts` est remplacé par `src/proxy.ts`.

Site public : accueil, à-propos, actions, événements, actualités, galerie, adhésion, soutenir,
contact, mentions légales. Espace membre : cotisations, inscriptions, profil. Espace de gestion
(`/admin`) : adhésions, membres, événements, inscriptions, actualités, messages, rôles.

**Cinq rôles, calqués sur les organes statutaires** (`role_utilisateur`) : `membre` (aucun accès
à la gestion), `secretariat` (adhésions, inscriptions, messages), `tresorerie` (membres et
cotisations), `communication` (événements, actualités, galerie) et `admin` (tout, plus la
distribution des rôles). Le cloisonnement est porté par les politiques RLS, pas seulement par
l'interface. Le rôle et l'activation d'un profil ne se modifient que par un administrateur,
garanti en base par le déclencheur `proteger_role_profil`. L'ONG ne peut pas se retrouver sans
administrateur actif, et personne ne modifie son propre rôle.

Deux bases Supabase distinctes : production (`ljhswydcuonwuqazaxrh`) et développement
(`pjivyoratjuicpdqwbxr`). La base de production est quasi vide : toute vue de données doit tenir
sur zéro ligne.

## Brand Commitments

Le logo `public/brand/logo-ajmond-ci.svg` est figé. Le bleu marine et le rouge du logo restent la
base de l'identité, avec liberté d'en faire évoluer les nuances et d'élargir la palette
(confirmé le 2026-09-02). Le sigle s'écrit **A.J.MOND-CI**, le nom complet « Amie des Jeunes du
Monde de Côte d'Ivoire ».

## Evidence on Hand

Contenu réel et sourcé dans `src/content/organisation.ts`, tiré des Statuts et du Règlement
Intérieur 2019, du Plan d'action 2021-2022 et du projet de Forum 2e édition 2024 :

- Données d'enquête chiffrées avec leur source (Lycée Moderne d'Adzopé 1 ; rapport « Genre et
  usages de drogues en Côte d'Ivoire », 29 mai 2020).
- Sept établissements partenaires nommés, cinq partenaires techniques, historique 2019-2024.
- Déroulé horaire complet du Forum, montants de cotisation (5 000 FCFA d'adhésion, 1 000 FCFA
  par mois), organes statutaires, types de membres.
- Coordonnées réelles : siège Cocody Cité SIR, 22 BP 568 Abidjan 22, deux numéros, une adresse
  e-mail, présidente BOTO Logbo Marie Madeleine.

**Aucune photographie n'existe** : `public/` ne contient que le logo, la table `medias` est vide.
Ne rien fabriquer qui ressemble à une photo d'élève, d'établissement ou d'intervention. Le
commanditaire a choisi le 2026-09-02 de livrer des emplacements photographiques explicitement
marqués, à remplir plus tard.

Aucun témoignage, aucun label, aucun chiffre d'impact propre à l'ONG (nombre d'élèves touchés,
budget exécuté) n'est confirmé : ne pas en inventer.

## Product Principles

1. **Ne jamais inventer de preuve.** Les chiffres affichés portent leur source ; ce qui manque
   reste visiblement manquant plutôt que comblé.
2. **Quatre publics, une page.** L'accueil doit orienter explicitement chacun vers son parcours
   plutôt que s'adresser à une moyenne qui ne parle à personne.
3. **La présence physique est l'argument.** Ce sont les lieux, les partenaires nommés et le
   déroulé d'une journée qui rendent l'action crédible, pas les intentions.
4. **Sujet grave, ton sobre.** Addiction, violences et prostitution chez des mineurs : aucun
   registre publicitaire, aucune dramatisation, aucune image volée.
5. **Une base vide reste présentable.** Chaque liste, table et graphique se lit à zéro ligne.

## Accessibility & Inclusion

Site francophone (`fr-CI`), lu majoritairement sur mobile et sur des connexions inégales. Lien
d'évitement déjà en place. Contrastes AA exigés sur les fonds sombres comme clairs, navigation au
clavier complète, `prefers-reduced-motion` respecté.
