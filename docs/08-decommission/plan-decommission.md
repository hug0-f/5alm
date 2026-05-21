# Plan de décommission: Lebontroc

## 1. Inventaire des données personnelles

| Catégorie | Données | Durée de conservation | Localisation |
|-----------|---------|------------------------|--------------|
| Compte | Email, numéro de téléphone, mot de passe (hashé bcrypt) | Durée du compte | Table `users` |
| Activité | Solde d'heures, statut de vérification | Durée du compte | Table `users` |
| Historique transactions | Durée échangée, dates, parties impliquées | 5 ans (obligations comptables) | Table `transactions` |
| Messages | Contenu des échanges | Durée du compte | Table `messages` (fonctionnalité F3 non livrée à ce jour) |
| Notes & commentaires | Score, texte | Durée du compte | Table `ratings` (fonctionnalité F5 non livrée à ce jour) |

Le système ne collecte ni nom réel, ni adresse postale, ni photo, ni donnée bancaire. Le numéro de téléphone sert uniquement à la vérification du compte.

## 2. Procédure de suppression et d'anonymisation (RGPD)

### Droit à l'effacement (Art. 17 RGPD)

1. Désactiver le compte utilisateur (ajout d'un flag `deleted` sur la table `users`)
2. Supprimer les données directement identifiantes : email et numéro de téléphone
3. Anonymiser les transactions conservées pour archivage comptable (remplacer l'identifiant utilisateur par un identifiant opaque)
4. Supprimer les messages et notes liés au compte
5. Confirmer la suppression par email à l'utilisateur

### Portabilité des données (Art. 20 RGPD)

- Export au format JSON : compte, historique des transactions, messages envoyés
- À prévoir : un endpoint authentifié `GET /api/users/me/export` (non implémenté à ce jour, l'export se ferait sinon par une extraction directe en base)

## 3. Révocation des accès

1. Désactiver tous les comptes utilisateurs (flag `active = false`)
2. Révoquer les tokens JWT en circulation (blacklist ou rotation de secret)
3. Supprimer les clés API des services tiers (hébergeur, stockage, monitoring)
4. Révoquer les secrets GitHub Actions (CI/CD)
5. Supprimer les certificats TLS ou laisser expirer

## 4. Archivage légal

| Données | Durée d'archivage | Modalité |
|---------|------------------|---------|
| Historique transactions (anonymisé) | 5 ans | Export SQL archivé hors production |
| Logs d'accès | 1 an | Archivage compression |
| Documents contractuels (si applicables) | 5 ans | Stockage sécurisé |

## 5. Communication

| Étape | Délai avant décommission | Canal | Message |
|-------|-------------------------|-------|---------|
| Annonce | J-30 | Email à tous les utilisateurs | Annonce de fermeture, date, procédure d'export |
| Rappel | J-7 | Email | Dernier rappel, lien export données |
| Fermeture | J-0 | Page d'accueil + email | Message de fermeture, contacts support |
| Confirmation suppression | J+7 | Email | Confirmation de suppression des données |

*Lebontroc, Projet ALM M2 HESIAS*
