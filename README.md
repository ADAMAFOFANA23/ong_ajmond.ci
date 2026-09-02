> **Dépôt absorbé — ne plus développer ici.**
>
> Le 26 août 2026, le contenu documentaire et la demande d'adhésion de cette
> application ont été fusionnés dans `ong-ajmond-ci`, le dépôt déployé
> (branche `fusion-documentation-ong`). Les briques non reprises — espace
> membre Supabase Auth, cotisations en base, inscription nominative aux
> événements, actualités et galerie en base — le sont volontairement : voir
> la section « Sources documentaires de l'ONG » du README de `ong-ajmond-ci`.
>
> Ce dépôt est conservé comme référence de travail. Toute évolution du site
> se fait désormais dans `ong-ajmond-ci`.

---

# ONG A.J.MOND-CI — application web

Site institutionnel et espace de gestion de l'ONG **Amie des Jeunes du Monde de Côte d'Ivoire**
(A.J.MOND-CI), construit à partir des statuts 2019, du plan d'action 2021-2022 et du dossier de
projet « Forum d'échanges, d'écoute, de conseils et de restauration — 2ᵉ édition 2024 ».

**Stack :** Next.js 16 (App Router, React 19, TypeScript) · Tailwind CSS v4 · Supabase
(PostgreSQL + Auth + RLS) · déploiement Vercel.

---

## 1. Ce que contient l'application

### Site public

| Route | Contenu |
| --- | --- |
| `/` | Accueil : vision, chiffres du constat, missions, programmes, agenda, actualités |
| `/a-propos` | Carte d'identité statutaire, vision et objectifs, organes, membres, ressources, historique, partenaires |
| `/actions` | Les quatre programmes, le déroulé type d'un forum, la méthodologie en sept étapes |
| `/evenements` | Agenda (à venir / passés), alimenté par Supabase |
| `/evenements/[slug]` | Fiche événement + formulaire d'inscription ouvert aux non-membres |
| `/actualites`, `/actualites/[slug]` | Publications de l'ONG |
| `/galerie` | Photos des activités (Supabase Storage) |
| `/adhesion` | Droits, devoirs, cotisations et formulaire de demande d'adhésion |
| `/soutenir` | Dons, partenariats, mécénat de compétences et transparence budgétaire |
| `/contact` | Coordonnées et formulaire de contact |
| `/mentions-legales` | Mentions légales, données personnelles, données concernant les mineurs |

### Espace membre (`/espace-membre`)

Authentification Supabase. Suivi des cotisations et du restant dû, des inscriptions aux
événements, et mise à jour du profil.

### Administration (`/admin`)

Réservée aux profils de rôle `admin` :

- tableau de bord (indicateurs et dernières demandes) ;
- traitement des demandes d'adhésion ;
- annuaire des membres et saisie des cotisations ;
- création et publication d'événements ;
- consultation des inscriptions ;
- rédaction et publication des actualités ;
- traitement des messages de contact.

---

## 2. Mise en route

```bash
pnpm install
cp .env.example .env.local
```

Renseignez ensuite `.env.local` avec les clés du projet Supabase, puis :

```bash
pnpm dev
```

### Base de données

Dans le tableau de bord Supabase → **SQL Editor**, exécuter dans l'ordre :

1. `supabase/schema.sql` — tables, types, trigger de création de profil, politiques RLS ;
2. `supabase/seed.sql` — jeu de démonstration (5 événements du forum 2024, 3 articles).

### Créer le premier administrateur

1. Créer un compte depuis `/creer-compte` ;
2. dans Supabase → **Table editor** → `profils`, passer la colonne `role` de cette ligne à `admin`.

### Galerie

Les photos sont servies depuis un bucket public Supabase Storage (par exemple `galerie`). Insérez
les lignes correspondantes dans la table `medias` avec l'URL publique du fichier. `next.config.ts`
autorise automatiquement le domaine du projet Supabase déclaré dans les variables d'environnement.

---

## 3. Déploiement sur Vercel

1. Importer le dépôt dans Vercel ;
2. déclarer `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `NEXT_PUBLIC_SITE_URL`
   pour les environnements *Production* et *Preview* ;
3. déployer.

> ⚠️ Si le projet Vercel active la politique **Sensitive** sur les variables d'environnement, les
> variables `NEXT_PUBLIC_*` valent `""` au moment du build (elles ne sont déchiffrées qu'à
> l'exécution). Dans ce cas, désactivez la politique pour ces trois variables : Next.js les inline
> au build.

---

## 4. Organisation du code

```
src/
  app/                 routes (App Router) — site public, espace membre, /admin
  components/
    forms/             champs partagés et formulaires (Server Actions + useActionState)
    layout/            en-tête, pied de page, navigation d'administration
    sections/          cartes réutilisables (événement, article)
    ui/primitives.tsx  système de composants (Section, Badge, Bouton, Carte…)
  content/             contenu institutionnel extrait des documents de l'ONG
  lib/
    actions/           Server Actions (public, auth, admin) validées avec Zod
    supabase/          clients navigateur / serveur, types, variables d'environnement
    donnees.ts         requêtes de lecture
    format.ts          formatage dates et montants (fr-FR, fuseau Africa/Abidjan)
  proxy.ts             protection des routes /admin et /espace-membre
supabase/
  schema.sql           schéma et politiques RLS
  seed.sql             données de démonstration
```

### Sécurité

- Chaque table est protégée par des politiques **RLS** : lecture publique limitée aux contenus
  publiés, dépôt public autorisé sur les formulaires, lecture et écriture complètes réservées aux
  administrateurs.
- Le fichier `proxy.ts` redirige les visiteurs non authentifiés et les membres non administrateurs.
- Les Server Actions revalident systématiquement le rôle côté serveur : le proxy n'est qu'une
  première barrière.

### Identité visuelle

Les couleurs sont dérivées du logo : bleu `#3c58a7` (`bleu-600`) et rouge `#ed2024`
(`brique-500`), sur un fond sable `#fbf8f3`. Typographies : Outfit (titres) et Inter (texte).
