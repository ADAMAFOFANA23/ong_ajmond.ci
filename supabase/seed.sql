-- =====================================================================
--  Jeu de données de démonstration — ONG A.J.MOND-CI
--  À exécuter APRÈS schema.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Garde-fou : le schéma doit exister avant d'insérer quoi que ce soit.
--
-- Sans ce bloc, une exécution prématurée s'arrête sur un « relation
-- public.evenements does not exist » (42P01) qui laisse croire à un
-- fichier fautif, alors qu'il ne manque qu'une étape.
-- ---------------------------------------------------------------------
do $$
declare
  manquantes text;
begin
  select string_agg(nom, ', ' order by nom)
    into manquantes
    from unnest(array['evenements', 'articles']) as nom
   where to_regclass('public.' || nom) is null;

  if manquantes is not null then
    raise exception
      'Table(s) % introuvable(s) : exécutez d''abord supabase/schema.sql sur CETTE base, puis rejouez ce fichier.',
      manquantes;
  end if;
end $$;

insert into public.evenements
  (slug, titre, chapo, description, programme, etablissement, lieu, ville, debut_le, fin_le, capacite, publie)
values
  (
    'forum-mamie-faitai-2024',
    'Forum d''échanges — Lycée Mamie Faitai de Bingerville',
    'Première étape de la 2e édition du forum, sur le thème du développement personnel.',
    'Exposés de psychologues et de spécialistes des sciences de l''éducation, ateliers en petits groupes puis restitution en plénière. Remise de diplômes de participation et de gadgets aux élèves les plus engagés.',
    'forum-echanges-ecoute-conseils',
    'Lycée Mamie Faitai de Bingerville',
    'Salle polyvalente',
    'Bingerville',
    '2024-02-21 07:00:00+00', '2024-02-21 12:30:00+00', 300, true
  ),
  (
    'forum-sainte-marie-2024',
    'Forum d''échanges — Lycée Sainte-Marie de Cocody',
    'Deuxième étape du forum 2024 dans la DREN Abidjan-1.',
    'Journée d''échanges, d''écoute et de conseils autour du développement personnel et de la résistance aux influences.',
    'forum-echanges-ecoute-conseils',
    'Lycée Sainte-Marie de Cocody', 'Salle de conférence', 'Abidjan',
    '2024-03-20 07:00:00+00', '2024-03-20 12:30:00+00', 300, true
  ),
  (
    'forum-classique-cocody-2024',
    'Forum d''échanges — Lycée Classique de Cocody',
    'Troisième étape du forum 2024.',
    'Exposés, ateliers et restitution, en présence du personnel éducatif et des autorités de l''établissement.',
    'forum-echanges-ecoute-conseils',
    'Lycée Classique de Cocody', 'Salle polyvalente', 'Abidjan',
    '2024-04-24 07:00:00+00', '2024-04-24 12:30:00+00', 300, true
  ),
  (
    'forum-angre-2024',
    'Forum d''échanges — Lycée Moderne d''Angré',
    'Quatrième étape du forum 2024.',
    'Journée complète de sensibilisation, d''écoute et de conseils.',
    'forum-echanges-ecoute-conseils',
    'Lycée Moderne d''Angré / Cocody', 'Salle polyvalente', 'Abidjan',
    '2024-05-15 07:00:00+00', '2024-05-15 12:30:00+00', 300, true
  ),
  (
    'forum-moderne-cocody-2024',
    'Forum d''échanges — Lycée Moderne de Cocody',
    'Clôture de la 2e édition du forum.',
    'Dernière étape du cycle 2024 : exposés, ateliers, restitution et remise de dons à l''établissement d''accueil.',
    'forum-echanges-ecoute-conseils',
    'Lycée Moderne de Cocody', 'Salle polyvalente', 'Abidjan',
    '2024-05-29 07:00:00+00', '2024-05-29 12:30:00+00', 300, true
  )
on conflict (slug) do nothing;

insert into public.articles (slug, titre, chapo, contenu, categorie, auteur, publie, publie_le)
values
  (
    'pourquoi-le-forum',
    'Pourquoi un forum d''échanges dans les lycées ?',
    'L''enseignement secondaire est une période de transition critique : c''est là que se jouent les premières consommations.',
    E'Selon l''enquête nationale sur la consommation de drogue et la santé parmi les élèves des écoles secondaires en Côte d''Ivoire (ONUDC, 2017), la consommation de substances est courante chez les élèves du secondaire. L''alcool est la principale substance consommée et la prévalence des autres substances reste élevée.\n\nC''est pourquoi l''ONG A.J.MOND-CI a choisi d''intervenir directement dans les établissements : le forum d''échanges, d''écoute, de conseils et de restauration réunit sur une matinée les élèves, des psychologues, des médecins et le personnel éducatif.\n\nLes sensibilisations menées depuis 2019 montrent que la majorité des jeunes concernés se sont laissés influencer par leurs camarades. Travailler la personnalité et la capacité à dire non est donc au cœur de notre démarche.',
    'Prévention', 'Bureau Exécutif', true, now() - interval '30 days'
  ),
  (
    'genre-et-usages-de-drogues',
    'Genre et usages de drogues : ce que disent les chiffres',
    'Les femmes usagères de drogues sont encore plus jeunes que les hommes au moment de la première consommation.',
    E'Le rapport « Genre et usages de drogues en Côte d''Ivoire » du 29 mai 2020 établit que la population impliquée dans le problème de consommation de drogues est majoritairement jeune, et touche particulièrement les élèves et étudiants.\n\nChez les hommes : 37,4 % des usagers ont entre 14 et 20 ans, et 38,62 % entre 21 et 30 ans.\n\nChez les femmes : 47,36 % ont entre 14 et 20 ans et 39,47 % entre 21 et 30 ans.\n\nCes données orientent nos actions vers les classes de la sixième à la terminale, avec une attention particulière portée aux jeunes filles, également exposées au harcèlement et aux violences sexuelles.',
    'Étude', 'Cellule communication', true, now() - interval '12 days'
  ),
  (
    'formation-des-encadreurs',
    'Former les encadreurs pour mieux repérer',
    'Un élève en difficulté est d''abord repéré par un adulte de l''établissement.',
    E'Le renforcement des capacités du personnel éducatif est l''un des cinq objectifs spécifiques de l''ONG. Nos ateliers apprennent aux éducateurs, assistants sociaux et animateurs à repérer les signaux faibles, à ouvrir le dialogue sans stigmatiser et à orienter vers les cellules d''aide.\n\nChaque cycle de formation est suivi d''une évaluation des cellules d''aide mises en place dans les établissements partenaires.',
    'Formation', 'Bureau Exécutif', true, now() - interval '4 days'
  )
on conflict (slug) do nothing;
