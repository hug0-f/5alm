# Requirements Traceability Matrix (RTM): Lebontroc

La RTM répond à la question : **pour chaque exigence, est-elle conçue, testée et livrée ?**

## Matrice

| ID | Intitulé | Composant conception | Cas de test | Sprint | Statut |
|----|----------|---------------------|-------------|--------|--------|
| US-001 | Inscription utilisateur | User (diagramme classes) · UC1 (use case) · Scénario 1 (séquence) | CT-AUTH-01, CT-AUTH-02 | Sprint 1 | Livré |
| US-002 | Vérification numéro par WhatsApp | User.verificationCode · Scénario 1 (séquence) | CT-AUTH-05, CT-AUTH-06 | Sprint 1 | Livré |
| US-003 | Connexion | User · UC2 | CT-AUTH-03, CT-AUTH-04 | Sprint 1 | Livré |
| US-004 | Dashboard solde | User.balance | Couvert par CT-AUTH-03 (affichage) et CT-AUTH-05 (mise à jour) | Sprint 1 | Livré |
| US-005 | Crédit de départ 1h | User.balance · Scénario 1 (séquence) | CT-AUTH-05 | Sprint 1 | Livré |
| US-006 | Profil utilisateur | User · UC3 | Test manuel (non automatisé) | Sprint 1 | Livré |
| US-007 | Publier une annonce | Listing · UC4 | CT-LIST-01 | Sprint 2 | Livré |
| US-008 | Consulter les annonces | Listing · UC5 | Couvert par CT-LIST-01 et CT-LIST-02 | Sprint 2 | Livré |
| US-009 | Filtre catégorie | Listing.category · UC6 | Test manuel (non automatisé) | Sprint 2 | Livré |
| US-010 | Filtre code postal | Listing.postalCode · UC6 | CT-LIST-02 | Sprint 2 | Livré |
| US-011 | Modifier/supprimer annonce | Listing | CT-LIST-03 | Sprint 2 | Livré |
| US-012 | Accepter/refuser une demande | Transaction · UC8 · POST /api/transactions/[id]/refuse | CT-TX-01 (refus implicite par validation), test manuel | Sprint 3 | Livré |
| US-013 | Valider (côté bénéficiaire) | Transaction · Scénario 2 (séquence) | CT-TX-01, CT-TX-02 | Sprint 3 | Livré |
| US-014 | Valider (côté prestataire) | Transaction · Scénario 2 (séquence) | CT-TX-01, CT-TX-03 | Sprint 3 | Livré |
| US-015 | Historique transactions | Transaction · GET /api/transactions · page /transactions | Test manuel | Sprint 3 | Livré |
| US-016 | Interdiction auto-échange | Transaction (règle métier, POST /api/transactions) | CT-TX-04 | Sprint 3 | Livré |
| US-017 | Envoyer un message | Message | Non couvert | Sprint 2 | Reporté |
| US-018 | Consulter conversations | Message | Non couvert | Sprint 2 | Reporté |
| US-019 | Répondre à un message | Message | Non couvert | Sprint 2 | Reporté |
| US-020 | Annuler une transaction | Transaction | Non couvert | Sprint 3 | Reporté |
| US-021 | Noter le prestataire | Rating | Non couvert | Sprint 3 | Reporté |
| US-022 | Noter le bénéficiaire | Rating | Non couvert | Sprint 3 | Reporté |
| US-023 | Note moyenne sur profil | Rating · User | Non couvert | Sprint 3 | Reporté |

**Légende statut** : Livré (conçu, codé, testé) · Reporté (non livré)

## Analyse des exigences non couvertes

### Exigences livrées sans cas de test automatisé (US-004, US-006, US-008, US-009)

Ces US sont couvertes par des tests manuels réalisés avant chaque démo. L'absence de test automatisé est un compromis délibéré : le délai d'une semaine ne permettait pas d'écrire des tests Jest pour des composants Next.js avec mocking de Prisma et de NextAuth. La couverture manuelle est documentée dans les cas de test.

### F4 (US-012 à US-016) : livrée au sprint 3

F4 est la fonctionnalité Must Have la plus complexe. Elle a été livrée en sprint 3 avec les garanties suivantes :
- Double validation par les deux parties avant transfert
- Transfert d'heures atomique dans une transaction SQL (isolation SERIALIZABLE)
- Idempotence des validations (double clic = même état)
- Refus possible par le prestataire avant finalisation
- Anti auto-échange (refus à la création si beneficiaryId == providerId)
- Vérification du solde au moment du transfert, pas à la création

Les cas de test CT-TX-01 à CT-TX-05 ont été exécutés manuellement après le déploiement, résultats dans `cas-tests.md`.

### Exigences reportées (F3 messagerie : US-017 à US-019)

La messagerie est classée Should Have. Elle a été reportée du sprint 2 au sprint 3 pour ne pas bloquer la livraison de F2, puis finalement non livrée : le temps du sprint 3 a été consacré à F4, la fonctionnalité Must Have la plus critique. C'est un arbitrage assumé, on a préféré livrer solidement le coeur du projet plutôt que d'étaler l'effort.

### Exigences optionnelles (US-020 à US-023)

Could Have : annulation de transaction et notation. Non développées, le temps disponible après F4 n'était pas suffisant. Le modèle de données les prévoit déjà (entité `Rating`, statut `ANNULEE` sur les transactions), une reprise serait directe.

---

> Le fichier CSV de la RTM est disponible dans `docs/10-tracabilite/rtm.csv`

*Lebontroc, Projet ALM M2 HESIAS*
