# Definition of Done: Lebontroc

La DoD, c'est notre contrat d'équipe. Une user story est terminée seulement si tous les critères ci-dessous sont remplis. Sans ça, on accumule des fonctionnalités "presque finies" qui deviennent de la dette silencieuse.

---

## Critères obligatoires pour toute US

- [ ] Le code correspond à ce qui est décrit dans la user story
- [ ] Le lint passe sans erreur (`npm run lint`)
- [ ] La fonctionnalité a été testée manuellement et fonctionne comme attendu
- [ ] La Pull Request a été relue et approuvée par au moins un autre membre de l'équipe
- [ ] La branche a été mergée dans main et supprimée
- [ ] Le pipeline CI passe (lint + tests + build) sur la PR

## Critères supplémentaires pour les US critiques (F4 : transactions)

- [ ] Le cas nominal fonctionne (les deux parties valident, les heures sont transférées)
- [ ] Les cas limites sont gérés : solde insuffisant, double validation concurrente, auto-échange
- [ ] La logique de validation des transactions est couverte par des tests unitaires Jest
- [ ] Le transfert d'heures de bout en bout est vérifié par les cas de test manuels (CT-TX)

## Ce qui n'est pas dans la DoD (hors périmètre du sprint)

- Tests end-to-end automatisés (traités en module 5)
- Monitoring et alertes (traités en module 6)
- Documentation technique exhaustive des fonctions

---

## Pourquoi cette DoD ?

On l'a faite courte exprès. Sur une semaine à 4 personnes, une DoD trop exigeante ralentit tout le monde sans réel bénéfice pour la démo. On a gardé seulement les critères qui protègent vraiment la stabilité de main et qui garantissent que ce qu'on merge est utilisable.
