-- =====================================================================
--  ONG A.J.MOND-CI — schéma Supabase
--  À exécuter dans l'éditeur SQL du projet Supabase.
--  Rejouable sans risque : le script est idempotent de bout en bout.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Préflight : tables héritées d'un schéma antérieur
--
-- `create table if not exists` ignore silencieusement une table déjà
-- présente, même si ses colonnes n'ont rien à voir avec celles attendues.
-- Les index, policies et requêtes qui suivent échouent alors en 42703 ou
-- 42P01, loin de la vraie cause et sans jamais la nommer.
--
-- On tranche le cas ici : une table incompatible et vide est supprimée,
-- une table incompatible qui contient des données interrompt le script
-- avec un message explicite plutôt que de détruire quoi que ce soit.
-- ---------------------------------------------------------------------
do $$
declare
  cible  record;
  lignes bigint;
begin
  for cible in
    select * from (values
      ('profils',           'type_membre'),
      ('demandes_adhesion', 'motivation'),
      ('cotisations',       'montant'),
      ('evenements',        'debut_le'),
      ('inscriptions',      'evenement_id'),
      ('articles',          'contenu'),
      ('medias',            'url'),
      ('messages',          'traite')
    ) as t(nom, temoin)
  loop
    -- Absente : le « create table » plus bas s'en chargera.
    if to_regclass('public.' || cible.nom) is null then
      continue;
    end if;

    -- Présente avec sa colonne témoin : c'est bien notre schéma, on garde.
    if exists (
      select 1 from information_schema.columns
       where table_schema = 'public'
         and table_name   = cible.nom
         and column_name  = cible.temoin
    ) then
      continue;
    end if;

    execute format('select count(*) from public.%I', cible.nom) into lignes;

    if lignes > 0 then
      raise exception
        'public.% existe dans une version incompatible (colonne « % » absente) et contient % ligne(s). Sauvegardez ces données, supprimez la table, puis rejouez ce script.',
        cible.nom, cible.temoin, lignes;
    end if;

    raise notice 'Table héritée public.% (vide, incompatible) supprimée.', cible.nom;
    execute format('drop table public.%I cascade', cible.nom);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------
do $$ begin
  create type type_membre as enum ('fondateur', 'actif', 'honneur', 'bienfaiteur');
exception when duplicate_object then null; end $$;

do $$ begin
  create type statut_demande as enum ('nouvelle', 'en_cours', 'acceptee', 'refusee');
exception when duplicate_object then null; end $$;

do $$ begin
  create type role_utilisateur as enum ('membre', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type statut_cotisation as enum ('a_payer', 'payee', 'en_retard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type nature_cotisation as enum ('adhesion', 'mensuelle', 'exceptionnelle', 'don');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- profils : prolonge auth.users
-- ---------------------------------------------------------------------
create table if not exists public.profils (
  id            uuid primary key references auth.users (id) on delete cascade,
  nom           text not null default '',
  prenoms       text not null default '',
  email         text not null,
  telephone     text,
  profession    text,
  ville         text,
  type_membre   type_membre not null default 'actif',
  role          role_utilisateur not null default 'membre',
  actif         boolean not null default true,
  date_adhesion date not null default current_date,
  cree_le       timestamptz not null default now()
);

comment on table public.profils is 'Membres de l''ONG, adossés aux comptes Supabase Auth.';

-- Création automatique du profil à l'inscription
create or replace function public.gerer_nouvel_utilisateur()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profils (id, email, nom, prenoms, telephone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    coalesce(new.raw_user_meta_data ->> 'prenoms', ''),
    new.raw_user_meta_data ->> 'telephone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.gerer_nouvel_utilisateur();

-- Helper : l'utilisateur courant est-il administrateur ?
create or replace function public.est_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profils
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- demandes_adhesion : formulaire public
-- ---------------------------------------------------------------------
create table if not exists public.demandes_adhesion (
  id             uuid primary key default gen_random_uuid(),
  nom            text not null,
  prenoms        text not null,
  email          text not null,
  telephone      text not null,
  profession     text,
  ville          text,
  type_membre    type_membre not null default 'actif',
  motivation     text not null,
  statut         statut_demande not null default 'nouvelle',
  note_interne   text,
  cree_le        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- cotisations
-- ---------------------------------------------------------------------
create table if not exists public.cotisations (
  id            uuid primary key default gen_random_uuid(),
  profil_id     uuid not null references public.profils (id) on delete cascade,
  nature        nature_cotisation not null default 'mensuelle',
  periode       text,                       -- ex. « 2024-03 »
  montant       integer not null check (montant >= 0),
  statut        statut_cotisation not null default 'a_payer',
  paye_le       date,
  cree_le       timestamptz not null default now()
);

create index if not exists idx_cotisations_profil on public.cotisations (profil_id);

-- ---------------------------------------------------------------------
-- evenements
-- ---------------------------------------------------------------------
create table if not exists public.evenements (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  titre          text not null,
  chapo          text,
  description    text,
  programme      text,                       -- slug du programme rattaché
  etablissement  text,
  lieu           text,
  ville          text,
  debut_le       timestamptz not null,
  fin_le         timestamptz,
  capacite       integer,
  image_url      text,
  inscriptions_ouvertes boolean not null default true,
  publie         boolean not null default false,
  cree_le        timestamptz not null default now()
);

create index if not exists idx_evenements_debut on public.evenements (debut_le desc);

-- ---------------------------------------------------------------------
-- inscriptions aux événements (ouvertes aux non-membres)
-- ---------------------------------------------------------------------
create table if not exists public.inscriptions (
  id            uuid primary key default gen_random_uuid(),
  evenement_id  uuid not null references public.evenements (id) on delete cascade,
  profil_id     uuid references public.profils (id) on delete set null,
  nom           text not null,
  prenoms       text not null,
  email         text not null,
  telephone     text,
  qualite       text,                        -- élève, encadreur, parent, partenaire…
  etablissement text,
  statut        statut_demande not null default 'nouvelle',
  cree_le       timestamptz not null default now(),
  unique (evenement_id, email)
);

create index if not exists idx_inscriptions_evenement on public.inscriptions (evenement_id);

-- ---------------------------------------------------------------------
-- articles (actualités)
-- ---------------------------------------------------------------------
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  titre         text not null,
  chapo         text,
  contenu       text not null,
  categorie     text not null default 'Actualité',
  couverture_url text,
  auteur        text,
  publie        boolean not null default false,
  publie_le     timestamptz,
  cree_le       timestamptz not null default now()
);

create index if not exists idx_articles_publie on public.articles (publie, publie_le desc);

-- ---------------------------------------------------------------------
-- galerie
-- ---------------------------------------------------------------------
create table if not exists public.medias (
  id            uuid primary key default gen_random_uuid(),
  titre         text not null,
  legende       text,
  url           text not null,
  lieu          text,
  prise_le      date,
  evenement_id  uuid references public.evenements (id) on delete set null,
  publie        boolean not null default true,
  cree_le       timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- messages de contact
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null,
  email         text not null,
  telephone     text,
  sujet         text not null,
  message       text not null,
  traite        boolean not null default false,
  cree_le       timestamptz not null default now()
);

-- =====================================================================
--  Row Level Security
-- =====================================================================
alter table public.profils            enable row level security;
alter table public.demandes_adhesion  enable row level security;
alter table public.cotisations        enable row level security;
alter table public.evenements         enable row level security;
alter table public.inscriptions       enable row level security;
alter table public.articles           enable row level security;
alter table public.medias             enable row level security;
alter table public.messages           enable row level security;

-- profils --------------------------------------------------------------
drop policy if exists "profil lisible par son proprietaire" on public.profils;
create policy "profil lisible par son proprietaire" on public.profils
  for select using (auth.uid() = id or public.est_admin());

drop policy if exists "profil modifiable par son proprietaire" on public.profils;
create policy "profil modifiable par son proprietaire" on public.profils
  for update using (auth.uid() = id or public.est_admin());

drop policy if exists "profil administrable" on public.profils;
create policy "profil administrable" on public.profils
  for all using (public.est_admin()) with check (public.est_admin());

-- demandes d'adhésion --------------------------------------------------
drop policy if exists "adhesion : depot public" on public.demandes_adhesion;
create policy "adhesion : depot public" on public.demandes_adhesion
  for insert with check (true);

drop policy if exists "adhesion : lecture admin" on public.demandes_adhesion;
create policy "adhesion : lecture admin" on public.demandes_adhesion
  for select using (public.est_admin());

drop policy if exists "adhesion : gestion admin" on public.demandes_adhesion;
create policy "adhesion : gestion admin" on public.demandes_adhesion
  for update using (public.est_admin());

-- cotisations ----------------------------------------------------------
drop policy if exists "cotisation : lecture membre" on public.cotisations;
create policy "cotisation : lecture membre" on public.cotisations
  for select using (auth.uid() = profil_id or public.est_admin());

drop policy if exists "cotisation : gestion admin" on public.cotisations;
create policy "cotisation : gestion admin" on public.cotisations
  for all using (public.est_admin()) with check (public.est_admin());

-- événements -----------------------------------------------------------
drop policy if exists "evenement : lecture publique" on public.evenements;
create policy "evenement : lecture publique" on public.evenements
  for select using (publie or public.est_admin());

drop policy if exists "evenement : gestion admin" on public.evenements;
create policy "evenement : gestion admin" on public.evenements
  for all using (public.est_admin()) with check (public.est_admin());

-- inscriptions ---------------------------------------------------------
drop policy if exists "inscription : depot public" on public.inscriptions;
create policy "inscription : depot public" on public.inscriptions
  for insert with check (true);

drop policy if exists "inscription : lecture" on public.inscriptions;
create policy "inscription : lecture" on public.inscriptions
  for select using (auth.uid() = profil_id or public.est_admin());

drop policy if exists "inscription : gestion admin" on public.inscriptions;
create policy "inscription : gestion admin" on public.inscriptions
  for all using (public.est_admin()) with check (public.est_admin());

-- articles -------------------------------------------------------------
drop policy if exists "article : lecture publique" on public.articles;
create policy "article : lecture publique" on public.articles
  for select using (publie or public.est_admin());

drop policy if exists "article : gestion admin" on public.articles;
create policy "article : gestion admin" on public.articles
  for all using (public.est_admin()) with check (public.est_admin());

-- médias ---------------------------------------------------------------
drop policy if exists "media : lecture publique" on public.medias;
create policy "media : lecture publique" on public.medias
  for select using (publie or public.est_admin());

drop policy if exists "media : gestion admin" on public.medias;
create policy "media : gestion admin" on public.medias
  for all using (public.est_admin()) with check (public.est_admin());

-- messages -------------------------------------------------------------
drop policy if exists "message : depot public" on public.messages;
create policy "message : depot public" on public.messages
  for insert with check (true);

drop policy if exists "message : gestion admin" on public.messages;
create policy "message : gestion admin" on public.messages
  for all using (public.est_admin()) with check (public.est_admin());
