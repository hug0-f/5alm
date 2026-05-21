# Analyse rétrospective individuelle : Thomas

*Projet Lebontroc, ALM M2 HESIAS, 2025-2026*

---

## Ce qui a bien fonctionné

**L'usage de Claude Code comme copilote de développement** a été utile sur les parties techniques : scaffolding des routes API, vérification OTP, migration vers Baileys. On a avancé plus vite sur le code sans se perdre dans des détails d'implémentation secondaires. Ce que j'en retiens, c'est qu'il faut quand même tout relire : sur la logique métier, l'outil se trompe assez vite si on ne cadre pas bien la demande.

**La migration Twilio vers WhatsApp/Baileys** m'a marqué sur la capacité d'adaptation. Quand on a vu que Twilio bloquait les SMS français sur les comptes d'essai (réglementation ARCEP 2023), on aurait pu se perdre une journée à comparer des alternatives payantes. A la place, on a basculé vers une solution open source en quelques heures, et le résultat est meilleur : pas de quota, pas de coût.

**Le déploiement Docker dès le sprint 2** a éliminé les problèmes de "ça marche sur ma machine". La stack complète (app + wa-service) se lance en une commande, ce qui a fluidifié les tests manuels et la démonstration finale.

## Ce qui a moins bien fonctionné

**La gestion du service WhatsApp (Baileys) en production** a été plus fragile que prévu. Baileys maintient une connexion WebSocket persistante avec les serveurs WhatsApp, ce qui est incompatible avec les architectures serverless. On a dû héberger tout sur un VPS plutôt que d'utiliser Vercel comme prévu initialement, ce qui a allongé la phase de déploiement.

**La messagerie (F3) a été sous-estimée** en complexité et reportée. On avait planifié de la livrer en sprint 2 mais la gestion des conversations sans WebSocket (messages non temps réel, indicateur de lecture, liste par interlocuteur) demandait plus de réflexion sur le modèle de données qu'anticipé.

**Le rate limiting en mémoire** est une dette technique que j'aurais dû identifier plus tôt. En production, si le serveur redémarre, les compteurs sont réinitialisés. Une solution Redis aurait été la bonne approche, mais elle ajoutait un service supplémentaire à déployer.

## Ce que je ferais différemment

**Je validerais les services tiers avant de les intégrer dans le backlog.** Tester Twilio sur un numéro français dès le sprint 0 nous aurait évité la migration d'urgence. Le principe : jamais de dépendance externe sans un spike technique en avance.

**Je séparerais plus clairement le déploiement du développement.** On a eu des allers-retours entre le code local et le serveur qui ont créé de la confusion. Avec Docker dès le départ et un pipeline CI/CD configuré en sprint 1, on aurait évité les commits de correction de "ça ne marche que sur le serveur".

**Je planifierais F4 (transactions) en sprint 1.** C'est la fonctionnalité la plus critique et la plus complexe du projet, la règle des deux validations et le transfert d'heures atomique. L'aborder en sprint 3 crée une pression inutile. Dans un vrai projet, le risque le plus élevé doit être traité en premier.
