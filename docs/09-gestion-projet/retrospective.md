# Gestion de projet: Lebontroc

## Backlog & Sprint Board

État du backlog à la fin du sprint 3 (fin du projet).

| US | Intitulé | Sprint 1 | Sprint 2 | Sprint 3 |
|----|----------|----------|----------|----------|
| US-001 | Inscription | OK | | |
| US-002 | Vérification WhatsApp | OK | | |
| US-003 | Connexion | OK | | |
| US-004 | Dashboard solde | OK | | |
| US-005 | Crédit 1h | OK | | |
| US-006 | Profil | OK | | |
| US-007 | Publier annonce | | OK | |
| US-008 | Consulter annonces | | OK | |
| US-009 | Filtre catégorie | | OK | |
| US-010 | Filtre code postal | | OK | |
| US-011 | Modifier/suppr annonce | | OK | |
| US-012 | Accepter/refuser une demande | | | OK |
| US-013 | Valider (bénéficiaire) | | | OK |
| US-014 | Valider (prestataire) | | | OK |
| US-015 | Historique transactions | | | OK |
| US-016 | Interdiction auto-échange | | | OK |
| US-017 | Envoyer un message | | Reporté | |
| US-018 | Consulter conversations | | Reporté | |
| US-019 | Répondre à un message | | Reporté | |
| US-020 | Annuler une transaction | | | Reporté |
| US-021 | Noter le prestataire | | | Reporté |
| US-022 | Noter le bénéficiaire | | | Reporté |
| US-023 | Note moyenne sur profil | | | Reporté |

**Légende** : OK = livrée · Reporté = reportée, non livrée

## Vélocité

| Sprint | US planifiées | US livrées | US reportées | Vélocité |
|--------|--------------|-----------|-------------|---------|
| Sprint 1 | 6 | 6 | 0 | 6 US |
| Sprint 2 | 8 | 5 | 3 (messagerie) | 5 US |

La messagerie (US-017 à US-019) a été reportée au sprint 3 pour prioriser la stabilité de F2 et le déploiement Docker.

## Rétrospective Sprint 2

### Ce qui s'est bien passé

- Le passage à Docker a vraiment simplifié les choses : la stack complète (app + wa-service) se lance en une commande
- Le pipeline CI/CD sur GitHub Actions tourne dès le premier merge, avec lint + build bloquants
- F2 (annonces) livrée dans les délais avec les deux filtres qui marchent
- Les PR GitHub ont bien tenu : chaque merge a eu au moins une relecture, pas de dérive

### Ce qui s'est moins bien passé

- On a sous-estimé la messagerie. Les conversations sans temps réel ont l'air simples sur le papier, mais le modèle de données demande plus de réflexion qu'on pensait. Du coup reportée au sprint 3.
- Le sprint 1 a été perturbé par le blocage Twilio sur les numéros français. On a dû basculer sur WhatsApp/Baileys en urgence, ce qui nous a coûté une demi-journée.
- Le rate limiting est en mémoire Node : il saute à chaque redémarrage du conteneur. On l'a identifié en dette technique pour plus tard.

### Actions d'amélioration

| Action | Responsable | Deadline |
|--------|------------|---------|
| Implémenter F4 transactions en priorité (Must Have critique) | Toute l'équipe | Sprint 3 |
| Compléter la messagerie si F4 terminé avant la fin | Hugo, Yanis | Sprint 3 |
| Rédiger les analyses rétrospectives individuelles | Chaque membre | Fin du projet |

## Métriques de suivi

### Taux de complétion

| Sprint | US planifiées | US livrées | Taux |
|--------|--------------|-----------|------|
| Sprint 1 | 6 | 6 | 100 % |
| Sprint 2 | 8 | 5 | 62,5 % |

### Burndown chart Sprint 2 (points = US)

| Jour | US restantes |
|------|-------------|
| J0 (début sprint) | 8 |
| J2 | 7 |
| J4 | 5 |
| J6 | 5 |
| J8 (fin sprint) | 3 (messagerie reportée) |

### Bugs ouverts

| Sprint | Bugs ouverts en fin de sprint |
|--------|------------------------------|
| Sprint 1 | 0 (bug Twilio résolu par migration WhatsApp) |
| Sprint 2 | 0 |

*Lebontroc, Projet ALM M2 HESIAS*
