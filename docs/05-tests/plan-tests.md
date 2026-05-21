# Plan de tests: Lebontroc

## Stratégie

On a deux niveaux :

- **Tests unitaires** avec Jest sur la logique pure : validation des entrées, parsing des annonces et des transactions, rate limiting. C'est du code sans dépendance externe, rapide à tester et c'est là qu'une régression passe le plus facilement inaperçue.
- **Tests manuels** sur les parcours utilisateur complets (inscription, publication d'annonce, échange de bout en bout). On les passe avant chaque démo pour vérifier que rien n'est cassé.

## Priorités de test

1. Double validation et transfert d'heures : c'est le coeur du projet
2. Inscription et vérification WhatsApp
3. Publication et filtrage des annonces

## Outils

- Jest pour les tests unitaires, lancés avec `npm test` et exécutés à chaque pull request via GitHub Actions
- next/jest pour la compilation TypeScript des tests (via SWC, avec l'alias `@/`)
- Les tests unitaires couvrent la logique pure : validation des entrées (email, mot de passe, numéro, code postal, annonce, transaction), catégories, rate limiting. Soit 40 cas répartis en 5 fichiers dans `app/src/lib/__tests__/`.
- Les parcours complets (inscription bout en bout, double validation d'une transaction) restent vérifiés par des tests manuels : les unit-tester demanderait de simuler la base et NextAuth, hors budget sur ce projet.

## Ce qu'on ne teste pas automatiquement

- La messagerie : fonctionnalité secondaire, vérifiée à la main
- La notation : optionnelle, testée manuellement si développée
- L'envoi WhatsApp : dépendance externe (Baileys), vérifié via l'endpoint `/api/health` du wa-service

## Rapport de couverture

### Couverture estimée par fonctionnalité

| Fonctionnalité | Cas testés | Couverture estimée | Méthode |
|----------------|-----------|-------------------|---------|
| F1, Authentification (US-001 à 006) | 6 cas (CT-AUTH-01 à 06) | ~80 % | Manuel + API |
| F2, Annonces (US-007 à 011) | 3 cas (CT-LIST-01 à 03) | ~70 % | Manuel + API |
| F4, Transactions (US-012 à 016) | 5 cas exécutés (CT-TX-01 à 05) | ~85 % | Manuel + API |
| F3, Messagerie (US-017 à 019) | Aucun cas défini | 0 % | Hors périmètre sprint |

### Zones non couvertes et justification

- **F4 Transactions** : livrée au sprint 3 (US-012 à 016). Les cas CT-TX-01 à CT-TX-05 ont été exécutés manuellement sur la prod. La validation des entrées d'une transaction est couverte par des tests Jest ; le transfert d'heures atomique lui-même est vérifié manuellement, car le tester en unitaire demanderait de simuler une transaction SQL SERIALIZABLE.
- **F3 Messagerie** : Should Have. Si elle est livrée au sprint 3, on la testera à la main.
- **Flux WhatsApp end-to-end** : on ne teste pas l'envoi réel via Baileys, parce que ça dépend d'un service externe. On mock l'appel HTTP vers wa-service et on vérifie que le compte est bien mis à jour en base. C'est suffisant pour notre besoin.
- **Authentification NextAuth** : la session (cookies, JWT) est gérée par NextAuth, qui est une bibliothèque testée. On ne teste pas la bibliothèque, on teste notre intégration.

### Couverture globale estimée

Sur les fonctionnalités livrées (F1 + F2), on estime la couverture manuelle à **75 %**. Ce qui manque, c'est surtout les cas limites réseau (timeout wa-service, base de données indisponible) et les flux de notation (Could Have).

*Lebontroc, Projet ALM M2 HESIAS, 2025-2026*
