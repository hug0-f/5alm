# Cas de test: Lebontroc

## F1 : Authentification

| ID | Préconditions | Étapes | Résultat attendu | Résultat obtenu |
|----|--------------|--------|-----------------|----------------|
| CT-AUTH-01 | Aucune | POST /api/register avec email valide, mot de passe valide et numéro de téléphone | 200, compte créé (isVerified = false, solde = 0), code OTP envoyé par WhatsApp, réponse contient phoneNumber | Conforme, compte créé, code WhatsApp reçu |
| CT-AUTH-02 | Email déjà enregistré | POST /api/register avec le même email | 409, message "Un compte existe déjà avec cet email ou ce numéro." | Conforme, 409 retourné |
| CT-AUTH-03 | Compte existant et vérifié | Connexion via /connexion avec bons identifiants | Session active, redirection vers le tableau de bord, solde affiché | Conforme, session créée, dashboard visible |
| CT-AUTH-04 | Compte existant | Connexion via /connexion avec mauvais mot de passe | Erreur affichée, pas de session créée | Conforme, message d'erreur affiché |
| CT-AUTH-05 | Compte créé, code reçu par WhatsApp | POST /api/verify avec le bon code | 200, compte vérifié (isVerified = true), solde crédité à 1h | Conforme, compte activé, solde = 1h |
| CT-AUTH-06 | Compte créé | POST /api/verify avec un code incorrect | 400, message "Code incorrect ou expiré." | Conforme, 400 retourné, compteur tentatives incrémenté |

## F4 : Transaction (double validation)

| ID | Préconditions | Étapes | Résultat attendu | Résultat obtenu |
|----|--------------|--------|-----------------|----------------|
| CT-TX-01 | Deux users (A prestataire, B bénéficiaire), B solde ≥ durée | B valide → A valide | Transaction FINALISEE, B débité, A crédité | Conforme, transfert atomique exécuté |
| CT-TX-02 | Transaction OUVERTE | B valide seul | beneficiaryValidated=true, providerValidated=false, statut OUVERTE | Conforme, aucun mouvement d'heures |
| CT-TX-03 | Transaction FINALISEE | Rejouer la validation de A | 200, état FINALISEE renvoyé sans rejouer le transfert | Conforme, idempotence respectée |
| CT-TX-04 | User A essaie d'être prestataire ET bénéficiaire | POST /api/transactions avec listing dont authorId = userId | 400, message "Vous ne pouvez pas réserver votre propre annonce." | Conforme, 400 retourné |
| CT-TX-05 | Bénéficiaire avec solde insuffisant | Les deux valident, solde du bénéficiaire < durée | 400, message "Solde insuffisant pour finaliser cet échange.", aucun débit | Conforme, transfert bloqué |

## F2 : Annonces

| ID | Préconditions | Étapes | Résultat attendu | Résultat obtenu |
|----|--------------|--------|-----------------|----------------|
| CT-LIST-01 | Utilisateur connecté et vérifié | POST /api/listings avec tous les champs valides | 200 (`success: true`), annonce créée et visible dans la liste | Conforme, annonce créée et visible |
| CT-LIST-02 | 3 annonces avec codes postaux 75001, 69001, 13001 | GET /api/listings?postalCode=75001 | Uniquement l'annonce 75001 retournée | Conforme, filtre opérationnel |
| CT-LIST-03 | Annonce créée par User A | User B tente DELETE /api/listings/{id} | 403, accès refusé | Conforme, 403 retourné |

*Lebontroc, Projet ALM M2 HESIAS*
