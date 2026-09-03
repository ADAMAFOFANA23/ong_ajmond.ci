# Design

Monde visuel de A.J.MOND-CI, adopté le 2026-09-02 en refonte du site public et de l'espace
d'administration. Le produit est décrit dans [PRODUCT.md](PRODUCT.md).

## Le problème que ce monde résout

Les deux références retenues par le commanditaire tirent leur autorité d'un matériau que ce
projet n'a pas. Le template Classroom X repose sur la photographie d'architecture universitaire :
pierre, lierre, échelle, lumière rasante. Le dashboard Backing repose sur des données denses et
un catalogue produit fourni. Ici, il n'existe **aucune photo** et la base est **quasi vide**.

Reproduire leur mise en page sans leur matière donnerait une coquille. Le monde ci-dessous
transfère donc la charge : **ce que la photographie portait, la typographie et la matière le
portent.**

## Ancrages

**Le document institutionnel.** L'ONG existe par ses statuts, son plan d'action, ses rapports
d'enquête. Le vocabulaire graphique est celui du document imprimé sérieux : filets fins, colonnes,
notes de source sous les chiffres, tableaux qui s'assument comme tableaux. C'est ce registre qui
rend une donnée croyable.

**Le mur.** Le hero et les respirations sont des aplats pleine largeur de bleu très sombre. Le
slab remplace le cadrage photographique : même verticalité, même autorité, aucune image inventée.

## Couleur

Le logo est figé, sa palette évolue.

- `bleu-950 → bleu-50` : l'ossature. `bleu-950` (#111a30) est la matière des slabs, `bleu-900`
  le texte. Un fond sombre n'est jamais du gris neutre.
- `brique-500` (#ed2024) : signal rare. Réservé à l'action principale, à l'état d'alerte et à
  l'accent unique d'une grille de données. Jamais deux accents dans le même écran.
- `craie` (ajouté) : ivoire chaud, fond des sections claires. Le blanc pur est réservé aux
  surfaces posées dessus — cartes, tables, formulaires — pour que l'élévation vienne du ton
  plutôt que de l'ombre.
- `emerald` : seulement pour un état positif dans les données. Jamais décoratif.

Texte secondaire sur fond coloré : teinté depuis la teinte du fond (`text-bleu-100/70` sur navy),
jamais un gris.

## Typographie

- **Display — Fraunces.** Serif à axes variables, dessinée pour les grandes tailles. Elle apporte
  la gravité institutionnelle que la pierre apportait dans la référence. Poids 300 en très grand,
  600-700 en titre de section. `opsz` suit la taille.
- **Texte et interface — Inter.** Neutre, excellente en petit corps et en données.
- Chiffres de données en `font-variant-numeric: tabular-nums` : une colonne de montants doit
  s'aligner.
- Interlignage serré en display (0.95-1.05), généreux en texte (1.7). Mesure de lecture 65-75ch.
- Pas de surtitre au-dessus des titres. Le titre porte seul.

## Structure

**Le filet, pas la carte.** La grille de cartes identiques est écartée comme structure de page.
Les listes — parcours par public, missions, partenaires — sont des lignes séparées par des filets
d'1px, dont le survol remplit la ligne entière. Cela tient sur une seule colonne en mobile sans
rien perdre.

**Le ruban.** Sous le hero, un bloc blanc chevauche le slab sombre, comme la bande de cartes du
template de référence. Il porte l'orientation par public : quatre lignes, quatre destinations.

**Emplacements photographiques.** Le composant `CadrePhoto` matérialise chaque image à venir :
ratio exact, dimensions annoncées, cadre hachuré. Il est visiblement incomplet — c'est le but —
et devient une vraie image dès qu'on lui passe une source.

## Mouvement

Un seul moment auteur : à l'ouverture, le filet du hero se déploie et le titre monte, en
`cubic-bezier(0.16, 1, 0.3, 1)`, depuis un état déjà visible. Ailleurs, uniquement des transitions
d'état (remplissage de ligne, survol de bouton). Aucune entrée au défilement.
`prefers-reduced-motion` neutralise tout.

## Surfaces du navigateur

Sélection, curseur, barres de défilement, anneau de focus et soulignés sont thématisés depuis la
palette. Ce sont les détails qui distinguent une page construite d'une page assemblée.

## Espace d'administration

Mode opératoire, pas persuasif. Barre latérale `bleu-950` fixe, contenu sur `craie`.
La référence Backing est suivie sur sa structure — rail sombre, rangée d'indicateurs, une carte
d'accent, graphique, table à pastilles de statut — et écartée sur son exubérance : pas de
sparkline décorative, pas d'ombre portée sur chaque bloc.

Contrainte dominante : **la base est vide.** Chaque indicateur, graphique et table possède un état
à zéro qui explique quoi faire, jamais un cadre vide ni un « 0 » orphelin.
