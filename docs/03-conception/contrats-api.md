# Contrats d'interface (API REST)

Ce document décrit les endpoints exposés par l'application. Tous les endpoints sont préfixés par `/api`.

---

## Authentification

Le facteur principal d'authentification est l'**adresse email** associée à un mot de passe. Le numéro de téléphone est utilisé uniquement pour la vérification du compte par WhatsApp. Ce n'est pas un identifiant de connexion.

---

## POST /api/register

Crée un compte utilisateur, génère un code OTP et déclenche l'envoi d'un message WhatsApp via le service Baileys interne.

**Corps de la requête**
```json
{
  "email": "utilisateur@exemple.fr",
  "password": "MotDePasse1",
  "phoneNumber": "0612345678"
}
```

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Compte créé, message WhatsApp envoyé (ou tentative d'envoi) |
| 400  | Email invalide, mot de passe invalide, numéro invalide |
| 409  | Email ou numéro déjà utilisé |
| 429  | Trop de tentatives (IP ou numéro) |
| 500  | Erreur serveur |

**Corps de la réponse (200)**
```json
{ "success": true, "phoneNumber": "+33612345678", "whatsappSent": true }
```

`whatsappSent` passe à `false` si l'envoi WhatsApp a échoué (le compte est quand même créé).

**Notes** : le code OTP (6 chiffres) est généré par le serveur, stocké en base avec une expiration de 10 minutes. Si l'envoi WhatsApp échoue, le compte est quand même créé et la réponse est 200. L'utilisateur peut demander un renvoi depuis la page de vérification.

---

## POST /api/resend

Génère un nouveau code OTP et le renvoie par WhatsApp pour un compte non encore vérifié.

**Corps de la requête**
```json
{ "phoneNumber": "0612345678" }
```

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Code renvoyé (ou numéro inexistant/déjà vérifié, réponse identique pour éviter l'énumération) |
| 400  | Numéro invalide |
| 429  | Trop de demandes |
| 500  | Erreur serveur |

---

## POST /api/verify

Vérifie le code OTP saisi par l'utilisateur. Si le code est valide, non expiré et dans la limite des tentatives, le compte passe à l'état vérifié et le solde est crédité de 1h.

**Corps de la requête**
```json
{
  "phoneNumber": "0612345678",
  "code": "123456"
}
```

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Code valide, compte vérifié, solde crédité de 1h |
| 400  | Code incorrect, expiré, compte déjà vérifié, ou trop de tentatives |
| 429  | Trop de tentatives |
| 500  | Erreur serveur |

**Notes** :
- Le code expire après 10 minutes.
- Maximum 5 tentatives par code. Au-delà, il faut demander un nouveau code.
- Tous les cas d'échec renvoient le même message générique ("Code incorrect ou expiré.") pour ne pas révéler si un numéro existe ou est déjà vérifié.

---

## GET /api/listings

Retourne la liste des annonces publiées. Filtre optionnel par catégorie et code postal.

**Paramètres de requête** (tous optionnels)

| Paramètre   | Type   | Description |
|-------------|--------|-------------|
| category    | string | Slug de catégorie (ex. `jardinage`) |
| postalCode  | string | Code postal à 5 chiffres |

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Liste des annonces (tableau, peut être vide) |
| 400  | Paramètre invalide |

**Corps de la réponse (200)**
```json
{
  "listings": [
    {
      "id": "cuid",
      "title": "Cours de guitare",
      "description": "...",
      "category": "musique",
      "postalCode": "75011",
      "duration": 60,
      "createdAt": "2026-05-20T10:00:00.000Z",
      "author": { "id": "cuid" }
    }
  ]
}
```

L'email de l'auteur n'est inclus que si l'appelant est connecté.

---

## POST /api/listings

Publie une nouvelle annonce. Requiert une session active avec un compte vérifié.

**Corps de la requête**
```json
{
  "title": "Cours de guitare",
  "description": "Je propose des cours pour débutants.",
  "category": "musique",
  "postalCode": "75011",
  "duration": 60
}
```

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Annonce créée, réponse `{ "success": true, "id": "cuid" }` |
| 400  | Champ manquant ou invalide |
| 401  | Non connecté |
| 403  | Compte non vérifié |
| 500  | Erreur serveur |

---

## GET /api/listings/[id]

Retourne le détail d'une annonce.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Annonce trouvée |
| 404  | Annonce introuvable |

---

## PATCH /api/listings/[id]

Modifie une annonce existante. Seul l'auteur peut modifier.

**Corps de la requête** : mêmes champs que POST /api/listings.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Annonce mise à jour |
| 400  | Champ invalide |
| 401  | Non connecté |
| 403  | Non propriétaire de l'annonce |
| 404  | Annonce introuvable |
| 500  | Erreur serveur |

---

## DELETE /api/listings/[id]

Supprime une annonce. Seul l'auteur peut supprimer.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Annonce supprimée |
| 401  | Non connecté |
| 403  | Non propriétaire de l'annonce |
| 404  | Annonce introuvable |
| 500  | Erreur serveur |

---

## POST /api/transactions

Crée une transaction à partir d'une annonce. L'utilisateur connecté en est le bénéficiaire, le prestataire est l'auteur de l'annonce. Requiert un compte vérifié.

**Corps de la requête**
```json
{ "listingId": "cuid" }
```

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Transaction créée, réponse `{ "success": true, "id": "cuid" }` |
| 400  | Annonce manquante, plus disponible, ou auto-échange (réserver sa propre annonce) |
| 401  | Non connecté |
| 403  | Compte non vérifié |
| 404  | Annonce introuvable |
| 500  | Erreur serveur |

La transaction est créée au statut `OUVERTE`, avec la durée reprise de l'annonce.

---

## GET /api/transactions

Liste les transactions de l'utilisateur connecté, qu'il soit bénéficiaire ou prestataire.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Liste des transactions, réponse `{ "transactions": [ ... ] }` |
| 401  | Non connecté |
| 500  | Erreur serveur |

---

## GET /api/transactions/[id]

Détail d'une transaction. L'appelant doit être l'un des deux participants.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Transaction trouvée, réponse `{ "transaction": { ... } }` |
| 401  | Non connecté |
| 403  | L'utilisateur n'est ni le bénéficiaire ni le prestataire |
| 404  | Transaction introuvable |

---

## POST /api/transactions/[id]/validate

Valide la transaction du côté de l'utilisateur connecté (bénéficiaire ou prestataire). Quand les deux parties ont validé, le transfert d'heures est exécuté : débit du bénéficiaire, crédit du prestataire, passage du statut à `FINALISEE`. Le tout dans une transaction SQL atomique en isolation `SERIALIZABLE`.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Validation enregistrée. Si les deux ont validé, transfert exécuté. Réponse `{ "success": true, "transaction": { ... } }` |
| 400  | La transaction est annulée, ou solde du bénéficiaire insuffisant pour finaliser |
| 401  | Non connecté |
| 403  | L'utilisateur n'est pas participant de la transaction |
| 404  | Transaction introuvable |
| 409  | Validation concurrente détectée (conflit de sérialisation), à réessayer |
| 500  | Erreur serveur |

**Notes** :
- L'opération est idempotente : revalider une transaction déjà validée par soi, ou déjà finalisée, ne rejoue pas le transfert.
- Le solde est vérifié au moment du transfert, pas à la création de la transaction.

---

## POST /api/transactions/[id]/refuse

Refus d'une demande par le prestataire. La transaction passe au statut `ANNULEE`, aucun transfert d'heures n'a lieu.

**Réponses**

| Code | Cas |
|------|-----|
| 200  | Transaction annulée, réponse `{ "success": true, "transaction": { ... } }` |
| 400  | La transaction est déjà finalisée, impossible de la refuser |
| 401  | Non connecté |
| 403  | Seul le prestataire peut refuser |
| 404  | Transaction introuvable |
| 500  | Erreur serveur |

---

## Règles communes

- Toutes les routes de mutation (POST, PATCH, DELETE) vérifient l'en-tête `Origin` pour prévenir les attaques CSRF.
- Les erreurs retournent toujours `{ "error": "message lisible" }`.
- Les succès retournent `{ "success": true, ...données }`.
