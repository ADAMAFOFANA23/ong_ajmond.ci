-- =====================================================================
--  Rôles de back-office et cloisonnement des accès.
--
--  Jusqu'ici `role_utilisateur` ne connaissait que 'membre' et 'admin' :
--  tout le bureau devait donc être administrateur pour publier une
--  actualité ou enregistrer une cotisation. Cette migration introduit trois
--  rôles calqués sur les organes statutaires de l'ONG, et fait porter le
--  cloisonnement par les politiques RLS plutôt que par la seule interface.
--
--  Elle corrige aussi une faille : la politique « profil modifiable par son
--  propriétaire » n'avait pas de `with check` et ne restreignait aucune
--  colonne. N'importe quel membre authentifié pouvait donc se promettre
--  `role = 'admin'` sur sa propre ligne. Un déclencheur l'interdit désormais.
--
--  Rejouable sans effet de bord.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Nouveaux rôles
-- ---------------------------------------------------------------------
alter type role_utilisateur add value if not exists 'communication';
alter type role_utilisateur add value if not exists 'tresorerie';
alter type role_utilisateur add value if not exists 'secretariat';

-- ---------------------------------------------------------------------
-- 2. Helpers
--
-- La comparaison passe par `role::text` : les étiquettes ajoutées
-- ci-dessus ne sont pas encore utilisables comme littéraux d'énumération
-- dans la même transaction, le cast contourne la limite proprement.
-- ---------------------------------------------------------------------
create or replace function public.role_courant()
returns text
language sql
stable
security definer set search_path = public
as $$
  select role::text from public.profils where id = auth.uid();
$$;

create or replace function public.a_un_role(roles text[])
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profils
    where id = auth.uid()
      and actif
      and role::text = any(roles)
  );
$$;

-- Administrateur général : le seul à pouvoir distribuer les rôles.
create or replace function public.est_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.a_un_role(array['admin']);
$$;

-- Toute personne ayant accès à l'espace de gestion, quel que soit son rôle.
create or replace function public.est_gestionnaire()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.a_un_role(array['admin', 'communication', 'tresorerie', 'secretariat']);
$$;

-- ---------------------------------------------------------------------
-- 3. Le rôle et l'activation ne se modifient que par un administrateur
-- ---------------------------------------------------------------------
create or replace function public.proteger_role_profil()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- `auth.uid()` est nul côté service_role et dans les scripts SQL : ces
  -- chemins-là sont déjà privilégiés et restent libres.
  if auth.uid() is null then
    return new;
  end if;

  if (new.role is distinct from old.role or new.actif is distinct from old.actif)
     and not public.est_admin() then
    raise exception
      'Seul un administrateur peut modifier le rôle ou l''activation d''un profil.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists proteger_role_profil on public.profils;
create trigger proteger_role_profil
  before update on public.profils
  for each row execute function public.proteger_role_profil();

-- ---------------------------------------------------------------------
-- 4. Politiques par domaine
--
-- Chaque table n'est ouverte qu'aux rôles qui en ont l'usage statutaire.
-- ---------------------------------------------------------------------

-- profils : la trésorerie doit voir les membres pour les cotisations.
drop policy if exists "profil lisible par son proprietaire" on public.profils;
create policy "profil lisible par son proprietaire" on public.profils
  for select using (auth.uid() = id or public.est_gestionnaire());

drop policy if exists "profil administrable" on public.profils;
create policy "profil administrable" on public.profils
  for all using (public.est_admin()) with check (public.est_admin());

-- adhésions et inscriptions : secrétariat.
drop policy if exists "adhesion : lecture admin" on public.demandes_adhesion;
create policy "adhesion : lecture admin" on public.demandes_adhesion
  for select using (public.a_un_role(array['admin', 'secretariat']));

drop policy if exists "adhesion : gestion admin" on public.demandes_adhesion;
create policy "adhesion : gestion admin" on public.demandes_adhesion
  for update using (public.a_un_role(array['admin', 'secretariat']));

drop policy if exists "inscription : lecture" on public.inscriptions;
create policy "inscription : lecture" on public.inscriptions
  for select using (
    auth.uid() = profil_id or public.a_un_role(array['admin', 'secretariat'])
  );

drop policy if exists "inscription : gestion admin" on public.inscriptions;
create policy "inscription : gestion admin" on public.inscriptions
  for all using (public.a_un_role(array['admin', 'secretariat']))
  with check (public.a_un_role(array['admin', 'secretariat']));

drop policy if exists "message : gestion admin" on public.messages;
create policy "message : gestion admin" on public.messages
  for all using (public.a_un_role(array['admin', 'secretariat']))
  with check (public.a_un_role(array['admin', 'secretariat']));

-- cotisations : trésorerie.
drop policy if exists "cotisation : lecture membre" on public.cotisations;
create policy "cotisation : lecture membre" on public.cotisations
  for select using (
    auth.uid() = profil_id or public.a_un_role(array['admin', 'tresorerie'])
  );

drop policy if exists "cotisation : gestion admin" on public.cotisations;
create policy "cotisation : gestion admin" on public.cotisations
  for all using (public.a_un_role(array['admin', 'tresorerie']))
  with check (public.a_un_role(array['admin', 'tresorerie']));

-- contenus éditoriaux : communication.
drop policy if exists "evenement : lecture publique" on public.evenements;
create policy "evenement : lecture publique" on public.evenements
  for select using (publie or public.est_gestionnaire());

drop policy if exists "evenement : gestion admin" on public.evenements;
create policy "evenement : gestion admin" on public.evenements
  for all using (public.a_un_role(array['admin', 'communication']))
  with check (public.a_un_role(array['admin', 'communication']));

drop policy if exists "article : lecture publique" on public.articles;
create policy "article : lecture publique" on public.articles
  for select using (publie or public.est_gestionnaire());

drop policy if exists "article : gestion admin" on public.articles;
create policy "article : gestion admin" on public.articles
  for all using (public.a_un_role(array['admin', 'communication']))
  with check (public.a_un_role(array['admin', 'communication']));

drop policy if exists "media : lecture publique" on public.medias;
create policy "media : lecture publique" on public.medias
  for select using (publie or public.est_gestionnaire());

drop policy if exists "media : gestion admin" on public.medias;
create policy "media : gestion admin" on public.medias
  for all using (public.a_un_role(array['admin', 'communication']))
  with check (public.a_un_role(array['admin', 'communication']));
