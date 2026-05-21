# Matrice des risques - Lebontroc

Pour chaque risque, on évalue probabilité et impact sur trois niveaux (faible / moyen / élevé).

| ID | Risque | Probabilité | Impact | Stratégie |
|----|--------|-------------|--------|-----------|
| R01 | La logique de double validation est plus complexe que prévu et nous fait dépasser les délais | Elevée | Elevé | On l'attaque dès que la base est en place, pas en dernier. Si on bloque, on simplifie : une seule validation plutôt que rien du tout. |
| R02 | Le service d'envoi de codes WhatsApp tombe et plus personne ne peut s'inscrire | Moyenne | Elevé | Baileys tourne sur notre VPS, sans quota ni coût. En cas d'incident, les inscriptions restent bloquées le temps du redémarrage du conteneur. |
| R03 | Des bots spamment le formulaire d'inscription pour faire bannir notre compte WhatsApp | Moyenne | Elevé | Rate limit par IP et par numéro sur une fenêtre courte. Validation du format E.164 avant tout envoi, et vérification que le numéro est bien sur WhatsApp. |
| R04 | Le modèle de données est mal pensé au départ et il faut tout reprendre à mi-parcours | Moyenne | Elevé | On valide le schéma ensemble avant d'écrire une ligne de code. Mieux vaut une heure de discussion qu'une journée de migration. |
| R05 | Le code écrit en parallèle par chacun ne s'assemble pas correctement | Moyenne | Moyen | On fixe les interfaces entre modules avant de coder. Points d'intégration réguliers, pas une seule grosse mise en commun à la fin. |
| R06 | Des idées nouvelles arrivent en cours de route et on perd du temps sur du hors-scope | Faible | Moyen | Toute idée est notée de côté et discutée en équipe. On l'intègre seulement si les Must Have sont terminés. |
| R07 | Une bibliothèque choisie ne convient pas et nous oblige à tout refaire | Faible | Elevé | Avant de s'engager sur une solution, on fait un test minimal pour vérifier qu'elle marche. Une heure de spike vaut mieux qu'une journée à défaire. |
| R08 | Quelqu'un code un truc que les autres ne comprennent pas, ce qui bloque la suite | Moyenne | Moyen | Règles simples : noms clairs, petits morceaux, et chacun explique brièvement son code aux daily. |

*Lebontroc - Projet ALM M2 HESIAS - 2025-2026*
