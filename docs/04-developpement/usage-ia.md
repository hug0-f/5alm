# Usage de l'IA dans le développement: Lebontroc

> Le TP ALM encourage l'usage d'outils d'aide au codage assisté par IA et demande de documenter leur utilisation et l'impact sur le flux de travail.

## Outil utilisé

**Claude Code**, en ligne de commande directement dans le terminal, sur les postes de dev de l'équipe.

## Comment on l'a utilisé

On s'en est servi pour le code : routes API, logique métier, fichiers de configuration.

| Phase | Usage | Exemples |
|-------|-------|----------|
| Développement | Scaffolding des routes API Next.js | Structure des handlers `register`, `verify`, `listings`, branchement Prisma, gestion d'erreurs |
| Développement | Implémentation de la vérification OTP | Code à 6 chiffres, expiration en base, compteur de tentatives |
| Développement | Migration vers WhatsApp/Baileys | Remplacement de Twilio quand les SMS ont été bloqués par la réglementation ARCEP, mise en place du wa-service |
| DevOps | Fichiers de configuration | Dockerfile multi-stage, docker-compose, workflow GitHub Actions, dependabot.yml |

## Impact sur notre flux

- **Gain de temps sur le code répétitif** : la migration Twilio vers Baileys, qu'on estimait à une journée de recherche et de dev, a été faite en une session. Pareil pour le scaffolding des routes : on part moins d'une feuille blanche.
- **Limites observées** : le code généré se trompe parfois sur les détails métier (gestion du solde insuffisant, statuts de transaction). Sans relecture avant merge, ça part en bug. On relit donc systématiquement.
- **Ce que l'outil ne fait pas à notre place** : la conception, les arbitrages produit, la validation métier, la réflexion sur le modèle de données. C'est du travail d'équipe.

*Lebontroc, Projet ALM M2 HESIAS*
