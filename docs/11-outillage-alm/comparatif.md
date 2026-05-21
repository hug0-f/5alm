# Comparatif d'outils ALM: Lebontroc

## Grille de critères (8 critères)

| # | Critère | Description |
|---|---------|-------------|
| C1 | Gestion du backlog | User stories, épics, priorisation MoSCoW |
| C2 | CI/CD intégré | Pipeline natif ou intégration facile GitHub Actions |
| C3 | Traçabilité | Lien exigence → ticket → commit → déploiement |
| C4 | Collaboration | Revues de code, commentaires, assignation |
| C5 | Courbe d'apprentissage | Prise en main en < 1h pour une équipe junior |
| C6 | Coût | Gratuit ou tier étudiant disponible |
| C7 | Reporting & métriques | Burndown, vélocité, dashboards |
| C8 | Documentation intégrée | Wiki, pages, markdown natif |

## Comparatif (note /5)

| Critère | GitHub + Actions | GitLab | Jira + Confluence |
|---------|:-:|:-:|:-:|
| C1, Backlog | 3 | 4 | 5 |
| C2, CI/CD | 5 | 5 | 2 |
| C3, Traçabilité | 4 | 4 | 5 |
| C4, Collaboration | 5 | 4 | 3 |
| C5, Courbe apprentissage | 5 | 4 | 2 |
| C6, Coût | 5 | 5 | 2 |
| C7, Reporting | 2 | 3 | 5 |
| C8, Documentation | 3 | 4 | 5 |
| **Total** | **32** | **33** | **29** |

## Recommandation motivée

**Choix retenu : GitHub + GitHub Actions**

**Justification** : à 4 étudiants sur une semaine, on a besoin d'aller vite et de ne pas perdre de temps à apprendre un nouvel outil. GitHub, tout le monde connaît déjà. GitHub Actions a le meilleur CI/CD natif gratuit, et la traçabilité commit ↔ issue suffit largement pour ce que le TP demande. Pour le backlog, GitHub Projects (vue Kanban + vue tableau) compense le fait qu'on n'a pas la richesse de Jira.

GitLab serait une alternative crédible (meilleur en tout-en-un), mais migrer le dépôt et réapprendre l'outil coûte plus que ça ne rapporte sur ce délai.

Jira + Confluence, on a écarté direct : trop lourd à configurer, payant au-delà de 10 utilisateurs, et le surplus du backlog avancé ne justifie pas la complexité sur un projet d'une semaine.

*Lebontroc, Projet ALM M2 HESIAS*
