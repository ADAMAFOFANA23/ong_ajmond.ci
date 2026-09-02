-- Promotion d'un compte existant au rôle administrateur.
--
-- Prérequis : le compte doit déjà exister dans Supabase Auth
-- (Dashboard → Authentication → Users → « Add user », ou via /creer-compte),
-- et supabase/schema.sql doit avoir été exécuté au préalable.
--
-- À exécuter dans Supabase → SQL Editor, après avoir remplacé l'adresse.

\set email 'adresse@exemple.ci'

-- 1. Filet de sécurité : si le trigger on_auth_user_created n'a pas tourné
--    (compte créé avant l'application du schéma), on crée le profil manquant.
insert into public.profils (id, email, nom, prenoms)
select u.id, u.email,
       coalesce(u.raw_user_meta_data ->> 'nom', ''),
       coalesce(u.raw_user_meta_data ->> 'prenoms', '')
from auth.users u
where u.email = :'email'
on conflict (id) do nothing;

-- 2. Promotion.
update public.profils
   set role = 'admin', actif = true
 where email = :'email';

-- 3. Vérification : doit renvoyer exactement une ligne, role = admin,
--    et une date de confirmation non nulle (sinon la connexion sera refusée).
select p.email, p.nom, p.prenoms, p.role, p.actif,
       u.email_confirmed_at
  from public.profils p
  join auth.users u on u.id = p.id
 where p.email = :'email';
