# Plan de maintenance: Lebontroc

## Incidents possibles

| ID | Description | Criticité | Comment le détecter | Comment le résoudre | Délai cible |
|----|-------------|-----------|---------------------|---------------------|-------------|
| INC-01 | L'application est inaccessible | Haute | Alerte UptimeRobot | Rollback via git revert, pipeline CD redéploie automatiquement | 5 min |
| INC-02 | Un échange débite les heures deux fois | Haute | Remontée d'un utilisateur | Correction manuelle du solde + correctif + nouveau déploiement | 1 h |
| INC-03 | Impossible de se connecter | Haute | Remontée d'un utilisateur | Rollback vers la version précédente | 15 min |
| INC-04 | Les annonces ne s'affichent plus | Moyenne | Remontée d'un utilisateur | Correctif sur une branche → merge → redéploiement manuel (git push origin main, pipeline CD redéploie via docker compose) | 2 h |
| INC-05 | Perte de données suite à une migration ratée | Critique | Erreurs dans les logs Docker (docker compose logs) | Restauration du dernier dump PostgreSQL (pg_dump planifié, voir section Sauvegardes) | 4 h |

## Compromis techniques acceptés

| ID | Ce qu'on a simplifié | Conséquence | Ce qu'on ferait en v2 |
|----|---------------------|-------------|----------------------|
| DT-01 | Pas de pagination sur la liste des annonces | Si beaucoup d'annonces, la page peut être longue à charger | Ajouter une pagination |
| DT-02 | Les erreurs de formulaire ne s'affichent qu'après envoi | L'expérience utilisateur est moins fluide | Valider les champs en temps réel côté navigateur |
| DT-03 | Les transactions ne s'annulent pas automatiquement si elles restent sans réponse | Des transactions peuvent rester ouvertes indéfiniment | Ajouter un mécanisme d'expiration automatique après 7 jours |

## Sauvegardes de la base

La base PostgreSQL a été rapatriée de Railway vers un conteneur sur le VPS (voir adaptations selon les contraintes). On perd au passage les sauvegardes automatiques que Railway fournissait, donc on les remplace par un `pg_dump` planifié.

Une tâche cron tourne chaque nuit à 3h sur le VPS. Elle exporte la base dans un fichier daté et supprime les dumps de plus de 7 jours :

```cron
0 3 * * * docker exec lebontroc-db pg_dump -U lebontroc lebontroc > /home/debian/backups/lebontroc-$(date +\%F).sql && find /home/debian/backups -name "lebontroc-*.sql" -mtime +7 -delete
```

Les dumps sont stockés dans `/home/debian/backups/`. Restauration en cas d'incident :

```bash
cat /home/debian/backups/lebontroc-AAAA-MM-JJ.sql \
  | docker exec -i lebontroc-db psql -U lebontroc lebontroc
```

## Niveaux de service

| Indicateur | Objectif | Comment on le mesure | Que fait-on si c'est dépassé |
|-----------|---------|---------------------|------------------------------|
| Disponibilité | 99 % par semaine | UptimeRobot (vérification toutes les 5 min) | Alerte email + investigation |
| Temps de réponse | Moins de 500 ms en moyenne | Logs Docker (docker compose logs app) | On cherche la requête qui ralentit |
| Taux d'erreurs serveur | Moins de 1 % | UptimeRobot + logs Docker | Alerte + rollback si ça dépasse 5 % |

## Mises à jour des dépendances

On utilise Dependabot, configuré sur le dépôt GitHub. Une fois par semaine, il ouvre automatiquement des pull requests pour les dépendances qui ont une mise à jour disponible. Le CI tourne dessus, et la PR n'est mergeable que si lint + tests + build passent.

Configuration dans `.github/dependabot.yml` : deux écosystèmes (npm dans `app/` et dans `service/`), planning hebdomadaire, regroupement des mises à jour mineures pour limiter le bruit.

### Dashboard Dependabot

![Dashboard Dependabot recent jobs](images/dependabot-dashboard.png)

Le dashboard montre l'historique des scans. On voit ici que Dependabot a déjà tourné plusieurs fois sur `app/package.json`. Le job le plus récent a abouti à l'ouverture de la PR #9. Les jobs précédents en erreur "Dependabot cannot open any more pull requests" signalent qu'on a atteint la limite par défaut de 5 PR ouvertes simultanément : ce n'est pas un bug, c'est un garde-fou pour éviter de noyer l'équipe sous les PR.

### Exemple de PR générée

![Pull request Dependabot #9 : bump eslint](images/dependabot-pr.png)

Sur cette PR, Dependabot a généré automatiquement :
- Un titre au format Conventional Commits (`chore(deps-dev): bump eslint from 9.39.4 to 10.4.0 in /app`)
- Une branche dédiée (`dependabot/npm_and_yarn/app/eslint-10.4.0`) sur laquelle le CI tourne
- Le corps de la PR avec les release notes et les commits du package
- Un score de compatibilité (28% ici, calculé sur l'historique des PR similaires dans d'autres projets, indication que le passage en majeur peut avoir des breaking changes à vérifier)
- La signature commit (badge "Verified") pour prouver que la PR vient bien du bot et pas d'un attaquant

L'équipe relit la PR, vérifie que les checks CI passent, et merge si tout va bien.

*Lebontroc, Projet ALM M2 HESIAS, 2025-2026*
