# Analyse rétrospective individuelle : Mohamed

*Projet Lebontroc, ALM M2 HESIAS, 2025-2026*

---

## Ce qui a bien fonctionné

- Les rôles tournants ont vraiment porté leurs fruits. J'ai pu toucher à la fois au backend (routes API, schéma Prisma) et au front (formulaires d'annonce, composants UI). Sans ça, je serais resté bloqué sur une seule couche du projet.
- Docker Compose a fait gagner un temps fou. Lancer la stack complète (app, wa-service, accès Postgres distant) en une commande évite les "ça marche chez moi". Reproduire un bug remonté par un coéquipier était immédiat.
- Les pull requests systématiques avec au moins une relecture avant merge. Plusieurs erreurs ont été rattrapées en review, notamment sur des routes API où il manquait des vérifications d'autorisation.
- La structure ALM imposée par le module. Avoir les dossiers `01-cadrage` à `12-retrospectives` a obligé à documenter au fil de l'eau plutôt qu'en bloc à la fin. Le RTM en particulier a évité que des US passent à la trappe.
- Le déploiement automatisé via le self-hosted runner sur le VPS. Une fois en place, on a pu pousser sans se poser de question sur le redémarrage des conteneurs.

## Ce qui a moins bien fonctionné

- L'estimation du sprint 2 était trop optimiste. On pensait livrer la messagerie en plus des annonces, on a fini par la reporter. J'avais sous-estimé la complexité du modèle de données (conversations, statut de lecture, lien à une annonce).
- Le pivot de Twilio vers WhatsApp/Baileys en sprint 1. On n'avait pas vérifié que Twilio bloquait les numéros français pour l'envoi de SMS sans préfiguration. Une demi-journée perdue sur du setup qu'on aurait dû détecter en cadrage technique.
- Le rate limiting en mémoire. J'ai laissé passer ce code en review alors qu'on savait que la `Map` ne survivrait pas aux redémarrages du conteneur, et qu'elle fuyait en mémoire (pas de purge). On l'a noté en dette technique au lieu de corriger tout de suite.
- La gestion des credentials. Le `DATABASE_URL` Railway s'est retrouvé en clair dans `CLAUDE.md`. Je n'ai pas relu assez attentivement le fichier au moment du merge. Le repo est privé mais le credential reste dans l'historique git.
- Pas de tests automatisés. Notre CI fait du lint et du build, rien de fonctionnel. Sur les routes critiques (inscription, vérification OTP, création d'annonce), une régression peut passer en prod sans qu'on s'en aperçoive avant la démo.
- Une certaine difficulté à dire stop quand un coéquipier proposait une feature non prévue. On a parfois élargi le scope sans repasser par la matrice MoSCoW.

## Ce que je ferais différemment

- Ajouter un socle de tests d'intégration dès le sprint 1, même minimal (3 ou 4 cas critiques par route). Le coût initial est faible et ça verrouille les régressions sur l'auth et les annonces.
- Cadrer plus tôt les contraintes techniques externes. Un POC Twilio sur un vrai numéro français en sprint 0 nous aurait évité tout le pivot Baileys en urgence.
- Refuser le "on corrige plus tard" en review. La dette sur le rate limiting et l'absence de cascade sur la suppression d'annonce auraient dû bloquer le merge. Si c'est dans la liste des problèmes connus, c'est qu'il faut le faire maintenant.
- Mettre en place un détecteur de secrets dès le départ (pre-commit ou gitleaks dans la CI). Une seule passe automatique aurait évité que le `DATABASE_URL` se retrouve dans la doc.
- Tenir un journal de bord individuel au fil des sprints. Pour rédiger cette rétrospective, j'ai dû reconstruire la chronologie à partir des commits et des PR. Quelques lignes par jour auraient suffi à garder une trace plus fidèle des décisions et des blocages.
- Aligner plus tôt l'équipe sur la définition de "fini". On a parfois mergé des US qui ne traitaient pas tous les cas d'erreur (rate limit non testé, messages d'erreur trop bavards). Une DoD plus stricte aurait permis d'éviter ces retours en arrière.
