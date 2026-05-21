# Fiche de cadrage du projet Lebontroc

## Description du projet

Lebontroc est une plateforme web où des particuliers échangent des services sans argent. Le principe : une heure rendue vaut une heure reçue, peu importe la nature du service. Un utilisateur qui donne un cours de guitare pendant une heure peut demander une heure d'aide au jardinage en retour. Chaque utilisateur a un solde en heures visible sur son espace personnel. Pour qu'un échange soit validé, les deux parties doivent confirmer que le service a bien eu lieu. On ne peut pas s'auto-échanger. Le projet cible une communauté locale, identifiée par code postal.

## Problème résolu

Les plateformes de mise en relation classiques marchent à l'argent. Les personnes qui ont du temps et des compétences mais peu de revenus sont mises de côté. Lebontroc propose une alternative : valoriser le temps de chacun à égalité, sans transaction monétaire.

## Equipe

| Membre | Role |
|--------|------|
| Hugo | Développement (rôles tournants) |
| Yanis | Développement (rôles tournants) |
| Thomas | Développement (rôles tournants) |
| Mohamed | Développement (rôles tournants) |

Chaque membre intervient sur l'ensemble des phases. Les tâches sont réparties au fil des sprints.

## Parties prenantes

| Partie prenante | Rôle | Attentes |
|----------------|------|----------|
| Utilisateur prestataire | Propose un service en échange d'heures | Pouvoir publier facilement une annonce et gérer ses demandes |
| Utilisateur bénéficiaire | Reçoit un service en dépensant des heures | Trouver un service près de chez lui et savoir comment valider l'échange |
| Equipe projet | Développe et livre l'application | Avoir un produit qui fonctionne et des livrables ALM cohérents |
| Enseignant (Jeremy Lardet) | Evalue le projet | Voir une démarche ALM rigoureuse et un produit démontrable |

## Fonctionnalités principales

| ID | Fonctionnalité | Priorité |
|----|---------------|----------|
| F1 | Authentification et profil utilisateur : inscription avec vérification par WhatsApp, connexion, solde, crédit de départ de 1h | Must Have |
| F2 | Publication et consultation d'annonces avec filtre par code postal et catégorie | Must Have |
| F3 | Messagerie entre utilisateurs pour organiser un échange | Should Have |
| F4 | Validation de transaction par les deux parties avec mouvement du solde d'heures | Must Have |
| F5 | Notation après un échange (note sur 5 et commentaire) | Could Have |

## Ce que le système ne fera pas

- Pas de géolocalisation GPS ni de carte, on filtre uniquement par code postal
- Pas de messagerie en temps réel, les messages sont consultés à l'ouverture de la page
- Pas de paiement réel, le projet repose exclusivement sur la monnaie de temps
- Pas d'espace d'administration ni de modération
- Pas d'application mobile

## Contraintes

**Techniques** : l'application doit être en ligne pour la démo. Stack Next.js + PostgreSQL. Tout tourne sur un VPS OVH : l'app, le service WhatsApp et la base, en conteneurs Docker.

**Organisationnelles** : 4 étudiants, rôles tournants, une semaine pour livrer. Les livrables sont dans `docs/` sur GitHub, accessibles à l'enseignant (compte : Mesta).

**Légales** : email et photo de profil entrent dans le périmètre RGPD. Un utilisateur peut demander la suppression de ses données à tout moment.

**Financières** : budget zéro. On avait commencé avec Railway pour la base (offre gratuite), mais le crédit mensuel s'épuise vite. On a tout regroupé sur le VPS de l'équipe : app, service WhatsApp et base. GitHub pour le dépôt et la CI.

*Lebontroc - Projet ALM M2 HESIAS - 2025-2026*
