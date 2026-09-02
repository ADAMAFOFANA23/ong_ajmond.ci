-- =====================================================================
--  Promotion d'un compte existant au rôle administrateur.
--
--  Prérequis : le compte doit déjà exister dans Supabase Auth — créé via
--  /creer-compte, ou par Dashboard → Authentication → Users → « Add user ».
--  supabase/schema.sql doit avoir été appliqué au préalable.
--
--  Remplacez l'adresse à la ligne « adresse constant text » (une seule
--  occurrence à modifier), puis exécutez le fichier entier.
--
--  Fonctionne aussi bien dans le SQL Editor du dashboard qu'avec psql :
--  aucune méta-commande \set, qui n'est comprise que par psql.
-- =====================================================================

do $$
declare
  adresse constant text := 'adresse@exemple.ci';
  cible   uuid;
  connus  text;
begin
  -- Supabase enregistre les adresses en minuscules : on compare normalisé pour
  -- qu'une majuscule ou un espace collé au copier-coller ne fasse pas échouer.
  select id into cible
    from auth.users
   where lower(email) = lower(btrim(adresse));

  if cible is null then
    select coalesce(string_agg(email, ', ' order by email), 'aucun')
      into connus
      from auth.users;

    raise exception
      'Aucun compte Supabase Auth pour « % ». Créez-le d''abord via /creer-compte ou Authentication → Users. Comptes existants : %.',
      adresse, connus;
  end if;

  -- Filet de sécurité : si le trigger on_auth_user_created n'a pas tourné
  -- (compte créé avant l'application du schéma), on crée le profil manquant.
  insert into public.profils (id, email, nom, prenoms)
  select u.id, u.email,
         coalesce(u.raw_user_meta_data ->> 'nom', ''),
         coalesce(u.raw_user_meta_data ->> 'prenoms', '')
    from auth.users u
   where u.id = cible
  on conflict (id) do nothing;

  update public.profils
     set role = 'admin', actif = true
   where id = cible;

  raise notice 'Compte % promu administrateur.', adresse;
end $$;

-- Vérification : doit renvoyer votre ligne, role = admin, actif = true,
-- et un email_confirmed_at NON NUL — sinon la connexion sera refusée.
select p.email, p.nom, p.prenoms, p.role, p.actif, u.email_confirmed_at
  from public.profils p
  join auth.users u on u.id = p.id
 where p.role = 'admin'
 order by p.email;
