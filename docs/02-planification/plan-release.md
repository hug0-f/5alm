# Plan de release - Lebontroc

3 sprints de 2 semaines. L'idée c'est de faire d'abord ce sans quoi l'app ne sert à rien, et de garder les fonctionnalités secondaires pour la fin.

## Sprint 1 : Mise en place et authentification

**Objectif** : un utilisateur crée un compte, vérifie son numéro, se connecte et voit son solde d'1h. L'app est déjà en ligne.

Sans authentification, rien d'autre ne peut marcher : c'est notre point de départ. Déployer tôt évite aussi les mauvaises surprises sur l'hébergement à une semaine de la démo.

| User Story |
|-----------|
| US-001 : Inscription avec email, mot de passe et numéro de téléphone |
| US-002 : Vérification du numéro par code WhatsApp |
| US-003 : Connexion |
| US-004 : Tableau de bord avec solde |
| US-005 : Crédit de 1h après vérification du numéro |
| US-006 : Profil utilisateur |

**C'est réussi si** : on peut créer un compte, le vérifier par WhatsApp, se connecter et voir un solde d'1h sur le tableau de bord. L'URL de l'application est accessible en ligne.

## Sprint 2 : Annonces et messagerie

**Objectif** : publier une annonce, parcourir celles des autres, filtrer, contacter un prestataire.

Les annonces sont le coeur du marché. Sans elles, il n'y a rien à échanger. On met la messagerie dans le même sprint parce qu'elle suit naturellement la consultation d'une annonce.

| User Story |
|-----------|
| US-007 : Publier une annonce |
| US-008 : Consulter la liste des annonces |
| US-009 : Filtrer par catégorie |
| US-010 : Filtrer par code postal |
| US-011 : Modifier ou supprimer une annonce |
| US-017 : Envoyer un message à un publieur |
| US-018 : Consulter ses conversations |
| US-019 : Répondre à un message |

**C'est réussi si** : on peut publier une annonce, la retrouver via les filtres et envoyer un message au publieur.

## Sprint 3 : Transactions et finalisation

**Objectif** : la boucle complète marche. Un prestataire accepte une demande, les deux valident, les heures se transfèrent.

C'est la fonctionnalité la plus importante du projet, donc la plus risquée. On la traite en dernier pour avoir une base solide avant de l'attaquer. La notation et la finalisation des livrables ALM tombent aussi dans ce sprint.

| User Story |
|-----------|
| US-012 : Accepter ou refuser une demande |
| US-013 : Valider un échange (côté bénéficiaire) |
| US-014 : Valider un échange (côté prestataire) |
| US-015 : Historique des transactions |
| US-016 : Empêcher l'auto-échange |
| US-020 : Annuler une transaction |
| US-021 à US-023 : Notation (si le temps le permet) |

**C'est réussi si** : on peut démontrer un échange complet de bout en bout, de la prise de contact jusqu'au transfert d'heures après double validation.

*Lebontroc - Projet ALM M2 HESIAS - 2025-2026*
