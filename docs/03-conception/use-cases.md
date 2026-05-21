# Diagramme de cas d'utilisation

## Acteurs

- **Visiteur** : utilisateur non connecté, peut uniquement s'inscrire et consulter les annonces publiques
- **Utilisateur** : compte actif et vérifié, accès à toutes les fonctionnalités de la plateforme
- **Système** : déclenche les opérations automatiques (crédit initial, transfert d'heures)

## Diagramme

![Diagramme de cas d'utilisation](images/use-case.png)

## Justification

Le diagramme couvre les cinq fonctionnalités du cadrage. F1 (authentification) est le point d'entrée : sans compte vérifié, on ne peut ni publier ni échanger. F2 (annonces) est le coeur de la plateforme. La consultation est ouverte au visiteur, mais publier demande un compte.

F3 (messagerie) sert à coordonner un échange avant de lancer une transaction. F4 (transaction) modélise la double validation, qui est la règle métier centrale du projet. F5 (notation) n'est accessible qu'après finalisation : on veut que les avis portent sur des échanges réels.

On a aussi mis le Système comme acteur, pour le crédit initial d'1h et le transfert d'heures à la finalisation. Ces deux opérations se font automatiquement, sans action utilisateur, donc elles méritent un acteur à part.
