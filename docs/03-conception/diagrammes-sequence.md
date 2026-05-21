# Diagrammes de séquence

## Scénario 1 : inscription et vérification WhatsApp

Ce scénario couvre l'inscription d'un nouveau visiteur, la réception du code WhatsApp, la vérification, et le crédit de 1h à l'activation du compte.

![Séquence inscription WhatsApp](images/sequence-inscription-whatsapp.png)

### Étapes détaillées

1. Le visiteur saisit son email, mot de passe et numéro de téléphone.
2. Le navigateur envoie `POST /api/register`.
3. Le serveur valide les champs (format email, force du mot de passe, format numéro E.164).
4. Le serveur vérifie qu'aucun compte n'existe déjà avec cet email ou ce numéro.
5. Le serveur génère un code OTP à 6 chiffres (`crypto.randomInt`) et calcule une expiration à 10 minutes.
6. Le serveur crée le compte en base (état `isVerified = false`, solde = 0, code et expiration stockés sur l'enregistrement utilisateur).
7. Le serveur envoie une requête HTTP au service WhatsApp interne (wa-service, port 3001).
8. Le service WhatsApp transmet le code au destinataire via Baileys (connexion WebSocket persistante vers les serveurs WhatsApp).
9. La réponse 200 est retournée même si l'envoi WhatsApp échoue : le compte est créé, l'utilisateur peut demander un renvoi.
10. L'utilisateur est redirigé vers `/verification?phone=+336...`.
11. L'utilisateur saisit le code reçu sur WhatsApp.
12. Le navigateur envoie `POST /api/verify`.
13. Le serveur récupère l'enregistrement utilisateur et vérifie : code correct, pas expiré, moins de 5 tentatives.
14. Si valide, le serveur met à jour le compte (`isVerified = true`, `balance = 1`, code effacé).
15. L'utilisateur est redirigé vers `/connexion?verified=1`.

**Renvoi de code** : si l'utilisateur n'a rien reçu, il clique sur "Renvoyer le code". Ca déclenche `POST /api/resend`, qui régénère un code, le stocke en base et le renvoie via WhatsApp.

**Connexion** : login par email + mot de passe. Le numéro de téléphone ne sert qu'à la vérification du compte, jamais pour se connecter.

**Justification** : on ne crédite le solde qu'après vérification du numéro. C'est ce qui rend la création de comptes en masse beaucoup plus coûteuse. On a écarté les SMS à cause de la réglementation ARCEP 2023 (les opérateurs français bloquent les identifiants alphanumériques non enregistrés). Du coup on utilise WhatsApp via Baileys : gratuit, pas de quota. Les codes OTP sont générés et vérifiés par notre app, stockés en base avec une expiration de 10 minutes.

---

## Scénario 2 : double validation d'une transaction

Ce scénario illustre le cas nominal où les deux parties valident la transaction, ce qui déclenche le transfert d'heures.

![Séquence double validation](images/sequence-double-validation.png)

### Étapes détaillées

1. Le bénéficiaire contacte le prestataire via la messagerie.
2. Les deux parties se mettent d'accord hors plateforme ou via messagerie.
3. Le bénéficiaire crée la transaction (statut : `OUVERTE`).
4. Le prestataire valide son côté (`providerValidated = true`).
5. Le bénéficiaire valide son côté (`beneficiaryValidated = true`).
6. Quand les deux validations sont à `true`, le serveur exécute le transfert en une seule transaction SQL atomique :
   - Débit du solde du bénéficiaire (`balance -= durée`)
   - Crédit du solde du prestataire (`balance += durée`)
   - Passage du statut à `FINALISEE`
7. Les deux utilisateurs voient leur tableau de bord mis à jour.

**Justification** : la double validation, c'est la règle métier centrale de Lebontroc. Chacun valide de son côté, et le transfert ne se déclenche que quand les deux ont confirmé. La transaction SQL garantit qu'on ne se retrouve jamais avec un débit sans crédit (ou l'inverse) : c'est tout ou rien. Le statut passe de `OUVERTE` à `FINALISEE` uniquement à ce moment-là.
