# Analyse rétrospective individuelle : Hugo

*Projet Lebontroc, ALM M2 HESIAS, 2025-2026*

---

## Ce qui a bien fonctionné

**Poser l'infra Docker et le VPS tôt** nous a évité pas mal de problèmes. Une fois la stack lançable en une commande, chacun a pu contribuer sans se battre avec son setup local. Les revues croisées étaient plus simples et on a gagné du temps sur les phases de test manuel, parce qu'on testait tous le même environnement.

**Le déploiement automatisé via un runner self-hosted sur le VPS** a vraiment changé le rythme du projet. Un push sur main déclenche le build CI puis le redéploiement complet sans aucune intervention manuelle. Ce que j'en retire, c'est qu'investir une journée sur le pipeline en début de projet en rembourse plusieurs par la suite : plus de SSH pour chaque correctif, plus de "j'ai oublié de rebuild", l'équipe pouvait pousser et passer à la suite.

**Le rapatriement de la base depuis Railway vers un PostgreSQL conteneurisé** a été anticipé avant que l'offre gratuite expire. Dump propre, version alignée (Postgres 18 côté Railway et VPS), volume Docker testé : on a évité un incident en plein sprint. C'est typiquement le genre de décision qui ne se voit pas si elle est bien faite, mais qui aurait été visible si on avait attendu.

## Ce qui a moins bien fonctionné

**Le runner self-hosted m'a pris plus de temps que prévu à mettre en place.** Entre les permissions systemd, le service utilisateur côté debian, le cache npm et `prisma generate` qui plantait sur le runner, j'ai enchaîné des allers-retours sur des points qui semblaient triviaux. J'ai sous-estimé la tâche parce qu'elle paraissait familière, et au final c'est ce qui a le plus retardé la mise en route de la chaîne de déploiement.

**La coordination git avec l'équipe n'a pas été assez cadrée.** En tant que mainteneur du dépôt, j'aurais dû poser une stratégie de branches claire dès le sprint 1. On s'est retrouvés avec des conflits sur des fichiers de config et des commits directs sur main pendant une partie du projet. Le résultat tient, mais ça a généré des frictions évitables et un peu de stress en fin de sprint.

**Mes estimations sur les tâches infra étaient systématiquement trop optimistes.** Migration de base, tunnel Cloudflare, persistance du volume wa-service : à chaque fois, je tablais sur quelques heures et il en fallait le double. Sur un projet noté sur le processus autant que sur le produit, ces dérapages se voient directement dans la vélocité affichée.

## Ce que je ferais différemment

**Je poserais toute l'infra en sprint 0**, avant la première User Story. VPS provisionné, Docker Compose en place, runner GitHub Actions branché, base conteneurisée et domaine exposé : une semaine de cadrage et F1 partait directement en prod au lieu d'attendre que la chaîne de déploiement existe.

**Je cadrerais les rôles et la propriété des fonctionnalités dès le kick-off.** J'ai pris naturellement la casquette infra et lead technique, mais sans le formaliser. Avec un ownership clair par feature (qui code, qui revue), on aurait évité que certaines parties stagnent en attendant un arbitrage.

**Je ferais un spike technique avant chaque dépendance externe.** Twilio, Baileys, Prisma 7 : à chaque fois on a pris la décision dans le sprint, et à chaque fois on a perdu des heures de debug sur une configuration mal documentée ou une limitation découverte trop tard. Une demi-journée de validation en amont aurait suffi à trancher proprement.
