# Adaptations selon les contraintes

## Contraintes RGPD

La base PostgreSQL est hébergée sur le VPS de l'équipe, chez OVH, en France. Les données personnelles (email, numéro, historique des transactions) restent donc physiquement en Europe, comme le demande le RGPD.

Pas de données bancaires : la plateforme tourne uniquement à la monnaie de temps. Ca simplifie pas mal le traitement des données sensibles.

## Contraintes de sécurité

**Vérification par WhatsApp avant activation**
A la création, le compte est inactif et le solde reste à 0 tant que le numéro n'a pas été vérifié par code WhatsApp. On a fait ce choix pour rendre la création de faux comptes coûteuse : vérifier un numéro de téléphone est beaucoup plus dur à automatiser qu'une confirmation par email.

On voulait au départ partir sur des SMS. La réglementation ARCEP 2023 nous a forcé à changer : les opérateurs français (Orange, SFR, Bouygues) bloquent les SMS avec un identifiant alphanumérique non enregistré, donc nos codes ne passaient pas. On est passé à WhatsApp via Baileys, un client WhatsApp Web non officiel. On le connecte en "appareil lié" à un compte WhatsApp de l'équipe. C'est gratuit, sans quota, pas de restriction sur les numéros destinataires.

**Protection contre les abus**
Rate limiting strict sur les endpoints d'envoi : 3 envois par numéro et par heure, 5 tentatives de saisie par code. Ce risque correspond à R03 dans la matrice des risques.

**Sécurité des mots de passe**
Bcrypt cost 12, longueur entre 8 et 72 caractères (72 étant la limite de bcrypt), au moins une lettre et un chiffre.

**Protection CSRF**
Toutes les routes de mutation vérifient l'en-tête Origin pour rejeter les requêtes cross-site.

**En-têtes de sécurité HTTP**
X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy et Permissions-Policy appliqués sur toutes les routes.

## Contraintes techniques

**Next.js full-stack**
Next.js avec l'App Router pour avoir le front et les API routes dans le même projet. Pas besoin de deux dépôts, déploiement plus simple.

**PostgreSQL et Prisma**
PostgreSQL pour les transactions ACID : c'est ce qui garantit qu'un transfert d'heures ne se fait jamais à moitié. Prisma 7 comme ORM, avec l'adapter pg pour la connexion.

**Base de données : de Railway au conteneur sur le VPS**
Au départ, on avait pris Railway pour la base : une offre PostgreSQL managée, région EU Frankfurt, mise en place en quelques minutes et sans serveur à gérer. Pratique pour démarrer vite. Le problème est venu après : l'offre gratuite fonctionne avec un crédit mensuel limité, et une fois ce crédit épuisé la base devient indisponible. Continuer aurait voulu dire payer un abonnement, ce qui ne rentre pas dans le budget zéro du projet.

On a donc basculé la base sur un conteneur PostgreSQL hébergé directement sur le VPS, dans le même `docker compose` que l'app et le service WhatsApp. Les données sont persistées dans un volume Docker. Ca ne coûte rien de plus (le VPS tourne déjà), la base n'est exposée que sur le réseau Docker interne, et les données restent en Europe. Le seul vrai inconvénient, c'est qu'on perd les sauvegardes automatiques de Railway : on les remplace par un `pg_dump` planifié (voir le plan de maintenance).

**Service WhatsApp séparé**
Baileys tourne dans un conteneur à part (wa-service, port 3001 en interne), sur le même VPS que l'app Next.js. Il faut un service séparé parce que Baileys garde une connexion WebSocket ouverte en permanence, et ça ne marche pas dans un environnement serverless.

**Hébergement VPS**
App Next.js, service WhatsApp et base PostgreSQL tournent sur le VPS de l'équipe, dans trois conteneurs orchestrés par Docker Compose. Le choix du VPS est imposé par Baileys, qui exige un process qui tourne en continu (incompatible avec le serverless).

## Contraintes organisationnelles

4 étudiants, rôles tournants. On a pris GitHub Flow pour sa simplicité : une branche par fonctionnalité, revue de code avant merge sur main.

## Contraintes financières

Budget zéro, donc tout en gratuit :
- VPS de l'équipe : app Next.js, service WhatsApp et base PostgreSQL, le tout en conteneurs
- Baileys : open source
- GitHub : dépôt + CI/CD (illimité sur runner self-hosted)

C'est cette contrainte qui nous a fait quitter Railway pour héberger la base sur le VPS (voir la section technique ci-dessus). Une dépendance gratuite peut devenir payante du jour au lendemain quand le crédit s'épuise : tout regrouper sur le VPS qu'on paie déjà nous met à l'abri de ce genre de surprise.

## Contraintes légales

Pas de solde négatif possible, jamais. Aucun découvert.

Pour le droit à l'effacement RGPD, les clés étrangères sont aujourd'hui en `ON DELETE RESTRICT` : on ne peut pas supprimer un utilisateur sans traiter d'abord ses données liées (annonces, transactions). C'est un choix volontaire, il évite de perdre par accident un historique de transactions encore utile à l'autre partie. La procédure d'effacement complète (anonymisation des transactions, suppression des données identifiantes) est détaillée dans le plan de décommission.
