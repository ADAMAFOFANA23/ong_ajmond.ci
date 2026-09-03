-- =====================================================================
--  Partenaires de l'ONG, administrables et illustrés d'un logo.
--
--  Jusqu'ici les établissements et les partenaires techniques étaient deux
--  listes de chaînes figées dans `src/content/organisation.ts` : ajouter un
--  lycée demandait un déploiement, et aucun logo ne pouvait être affiché.
--
--  La table est amorcée avec les douze partenaires déjà connus, pour que le
--  site ne perde rien et que le bureau n'ait plus qu'à compléter les logos.
--
--  Rejouable sans effet de bord.
-- =====================================================================

do $$ begin
  create type type_partenaire as enum (
    'etablissement',   -- lycées et collèges qui accueillent les interventions
    'technique',       -- universités, laboratoires, services de l'État
    'institutionnel',  -- ministères, DREN, collectivités
    'soutien'          -- bailleurs, entreprises, fondations
  );
exception when duplicate_object then null; end $$;

create table if not exists public.partenaires (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null unique,
  type        type_partenaire not null default 'etablissement',
  logo_url    text,
  site_url    text,
  ville       text,
  description text,
  ordre       integer not null default 0,
  publie      boolean not null default true,
  cree_le     timestamptz not null default now()
);

comment on table public.partenaires is
  'Établissements et partenaires de l''ONG. Amorcée depuis organisation.ts.';

create index if not exists idx_partenaires_type on public.partenaires (type, ordre);

alter table public.partenaires enable row level security;

drop policy if exists "partenaire : lecture publique" on public.partenaires;
create policy "partenaire : lecture publique" on public.partenaires
  for select using (publie or public.est_gestionnaire());

drop policy if exists "partenaire : gestion" on public.partenaires;
create policy "partenaire : gestion" on public.partenaires
  for all using (public.a_un_role(array['admin', 'communication']))
  with check (public.a_un_role(array['admin', 'communication']));

-- ---------------------------------------------------------------------
-- Amorçage : les partenaires déjà cités sur le site.
-- ---------------------------------------------------------------------
insert into public.partenaires (nom, type, ville, ordre)
values
  ('Lycée Mamie Faitai de Bingerville',      'etablissement', 'Bingerville', 1),
  ('Lycée Garçons de Bingerville',           'etablissement', 'Bingerville', 2),
  ('Lycée Sainte-Marie de Cocody',           'etablissement', 'Abidjan',     3),
  ('Lycée Classique de Cocody',              'etablissement', 'Abidjan',     4),
  ('Lycée Moderne de Cocody',                'etablissement', 'Abidjan',     5),
  ('Lycée Moderne d''Angré / Cocody',        'etablissement', 'Abidjan',     6),
  ('Lycée Moderne 1 d''Adzopé',              'etablissement', 'Adzopé',      7)
on conflict (nom) do nothing;

insert into public.partenaires (nom, type, ordre)
values
  ('CIERPA – UFR Cocody (psychologie sociale et clinique)', 'technique', 1),
  ('Département des sciences de l''éducation, UFR Cocody',  'technique', 2)
on conflict (nom) do nothing;

insert into public.partenaires (nom, type, ordre)
values
  ('Ministère de la Santé et de l''Hygiène Publique (PNLTA)', 'institutionnel', 1),
  ('DREN Abidjan-1',                                          'institutionnel', 2)
on conflict (nom) do nothing;
