# Analyse rétrospective individuelle : Yanis

*Projet Lebontroc, ALM M2 HESIAS, 2025-2026*

---

## Ce qui a bien fonctionné

Le `CategoryPicker` a bénéficié d'une animation `pop` au clic qui rend la sélection de catégorie réactive et agréable. Chaque case réagit avec un léger rebond via `cubic-bezier(0.34, 1.56, 0.64, 1)`, ce qui donne une impression de robustesse sans être tape-à-l'oeil. Combiner l'animation avec le changement de bordure et le fond bleu au survol crée un feedback visuel clair sur l'état sélectionné.

La barre de progression sur le formulaire de publication est une des décisions visuelles les plus réussies du projet. Elle est simple, 8px de hauteur, transition fluide sur 500ms, et elle change de couleur selon l'avancement : primaire, orange, bleu, vert. L'utilisateur comprend instantanément où il en est sans lire quoi que ce soit. Le message "Prêt à publier !" qui apparaît avec une animation `fade-in-up` quand les 5 champs sont remplis ajoute une micro-satisfaction utile.

L'overlay de confirmation à la publication est ce qui marque le plus. Les particules en burst qui partent depuis le centre de l'écran, la carte miniature de l'annonce qui s'affiche avec une animation `card-pop`, et la barre de progression de redirection en bas forment un enchaînement cohérent. L'utilisateur voit exactement ce qu'il vient de publier avant d'être redirigé. Ca transforme une action technique en moment.

---

## Ce qui a moins bien fonctionné

La tentative d'intégrer les images découpées directement dans les cartes d'annonces n'a pas abouti. L'idée était d'afficher chaque illustration en header de la `ListingCard`, posée sur un fond dégradé bleu. En pratique le rendu était générique, les images ne s'intégraient pas naturellement dans le gabarit de la carte, et l'ensemble paraissait encombré sans apporter de lisibilité supplémentaire. Le problème venait aussi d'une erreur de méthode : on a codé le composant avant de voir les images en contexte réel, et un 404 au premier test a confirmé que le dossier n'était pas dans `public/`.

---

## Ce que je ferais différemment

Toujours tester le rendu d'un asset dans son contexte avant de construire le composant autour. Ouvrir l'image dans le navigateur, la poser sur un fond similaire, voir si ça fonctionne visuellement. Ca prend deux minutes et ça évite de coder un composant entier pour un résultat décevant.

Sur les animations, je garderais la même approche : CSS pur défini dans `globals.css`, pas de librairie. Les keyframes `fly-up`, `burst-out` et `redirect-bar` sont légères, contrôlables, et n'ajoutent aucune dépendance. C'est la bonne échelle pour ce type de projet.
