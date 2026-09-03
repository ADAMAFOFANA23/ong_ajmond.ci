-- =====================================================================
--  Contenus de type liste.
--
--  `contenus_site` ne savait porter qu'une chaîne ou une image. Les
--  contenus statutaires — missions, chiffres d'enquête, historique,
--  qualités de membre — sont des listes d'enregistrements, et restaient
--  donc figés dans `src/content/organisation.ts`.
--
--  Une colonne `jsonb` suffit : ces listes sont courtes, lues en bloc et
--  jamais interrogées ligne à ligne. Une table par liste aurait multiplié
--  les schémas, les politiques et les écrans pour aucun gain.
--
--  Rejouable sans effet de bord.
-- =====================================================================

alter table public.contenus_site
  add column if not exists donnees jsonb;

comment on column public.contenus_site.donnees is
  'Contenus de type liste : tableau d''objets, validé côté application.';
