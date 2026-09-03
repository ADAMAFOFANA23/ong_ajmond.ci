-- =====================================================================
--  Téléversement d'images et contenus éditables du site.
--
--  Trois manques rendaient l'espace de gestion incomplet : aucun bucket de
--  stockage n'existait, donc aucun formulaire ne pouvait joindre d'image ;
--  la galerie n'avait pas de porte d'entrée ; et les textes du site vivaient
--  uniquement dans `src/content/organisation.ts`, hors de portée du bureau.
--
--  Rejouable sans effet de bord.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Bucket public « medias »
--
-- Lecture ouverte : les images illustrent un site public. Écriture réservée
-- aux rôles qui produisent du contenu.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('medias', 'medias', true)
on conflict (id) do update set public = true;

drop policy if exists "medias : lecture publique" on storage.objects;
create policy "medias : lecture publique" on storage.objects
  for select using (bucket_id = 'medias');

drop policy if exists "medias : depot gestionnaire" on storage.objects;
create policy "medias : depot gestionnaire" on storage.objects
  for insert with check (
    bucket_id = 'medias' and public.a_un_role(array['admin', 'communication'])
  );

drop policy if exists "medias : remplacement gestionnaire" on storage.objects;
create policy "medias : remplacement gestionnaire" on storage.objects
  for update using (
    bucket_id = 'medias' and public.a_un_role(array['admin', 'communication'])
  );

drop policy if exists "medias : suppression gestionnaire" on storage.objects;
create policy "medias : suppression gestionnaire" on storage.objects
  for delete using (
    bucket_id = 'medias' and public.a_un_role(array['admin', 'communication'])
  );

-- ---------------------------------------------------------------------
-- 2. Contenus éditables
--
-- Table de surcharges : une clé absente signifie « garder la valeur
-- livrée dans le code ». Le site n'est donc jamais vide, même sur une base
-- neuve, et une remise à zéro se fait en supprimant la ligne.
-- ---------------------------------------------------------------------
create table if not exists public.contenus_site (
  cle        text primary key,
  valeur     text,
  image_url  text,
  maj_le     timestamptz not null default now(),
  maj_par    uuid references public.profils (id) on delete set null
);

comment on table public.contenus_site is
  'Surcharges des textes et images du site public. Clé absente = valeur par défaut du code.';

alter table public.contenus_site enable row level security;

drop policy if exists "contenu : lecture publique" on public.contenus_site;
create policy "contenu : lecture publique" on public.contenus_site
  for select using (true);

drop policy if exists "contenu : gestion" on public.contenus_site;
create policy "contenu : gestion" on public.contenus_site
  for all using (public.a_un_role(array['admin', 'communication']))
  with check (public.a_un_role(array['admin', 'communication']));

-- ---------------------------------------------------------------------
-- 3. La galerie devient administrable par la communication
-- ---------------------------------------------------------------------
drop policy if exists "media : depot gestionnaire" on public.medias;
create policy "media : depot gestionnaire" on public.medias
  for insert with check (public.a_un_role(array['admin', 'communication']));
