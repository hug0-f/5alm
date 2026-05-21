# Conventions de commits: Lebontroc

## Format : Conventional Commits

```
type(scope): description courte #ticket

[corps optionnel]
```

**Types** : `feat` · `fix` · `test` · `docs` · `ci` · `refactor` · `chore`

**Scopes** : `auth` · `listings` · `transaction` · `messaging` · `rating` · `ci` · `db`

## 10 exemples représentatifs

Tirés de l'historique réel du dépôt :

```
feat(auth): ajout du formulaire d'inscription #1
feat(auth): envoi du code OTP via WhatsApp Baileys #2
feat(auth): crédit de 1h après vérification du numéro #5
feat(listings): création d'une annonce avec validation des champs #7
feat(listings): filtre par catégorie et code postal #10
feat(transaction): implémentation F4 double validation #12
fix(transaction): blocage du transfert si solde insuffisant #15
fix(security): uniformise les messages d'erreur de vérification #0
ci: ajout du step tests unitaires dans le pipeline #0
docs: mise à jour du README avec les instructions d'installation #0
```

## Règles

- Référencer le numéro de ticket quand il y en a un (`#numéro`)
- Description en français, à l'impératif ou en nom d'action, sans majuscule, sans point final
- Corps du commit si le contexte ne se déduit pas du titre

*Lebontroc, Projet ALM M2 HESIAS*
