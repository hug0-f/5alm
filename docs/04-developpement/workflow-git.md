# Workflow Git: Lebontroc

## Stratégie choisie : GitHub Flow

On a regardé GitFlow, GitHub Flow et Trunk-Based. GitFlow, c'est trop lourd pour 4 personnes sur une semaine (develop, release, hotfix, beaucoup trop de branches). Trunk-Based, c'est bien mais ça suppose une couverture de tests qu'on n'aura jamais le temps de mettre en place. GitHub Flow tombe juste : simple, main toujours déployable, branches courtes.

**Principe** : une branche `main` stable, et pour chaque fonctionnalité ou bug, une branche dédiée qu'on merge via Pull Request après revue, puis qu'on supprime.

---

## Branches

| Branche | Rôle |
|---------|------|
| `main` | Code de production, toujours déployable |
| `feature/xxx` | Développement d'une fonctionnalité liée à une US |
| `fix/xxx` | Correction d'un bug identifié |
| `hotfix/xxx` | Correction urgente directement sur main |

Le nom de la branche reprend l'identifiant de la user story : `feature/us-001-inscription`, `feature/us-014-validation-transaction`.

---

## Cycle de vie d'une fonctionnalité

1. On prend une US dans le backlog et on crée la branche depuis main :
   ```bash
   git checkout main
   git pull
   git checkout -b feature/us-007-publier-annonce
   ```

2. On code, on commit régulièrement (voir conventions ci-dessous).

3. Quand c'est prêt, on ouvre une Pull Request sur GitHub vers main.

4. Un autre membre de l'équipe relit le code et laisse des commentaires.

5. On corrige si besoin, puis la PR est approuvée et mergée.

6. La branche est supprimée après le merge.

---

## Conventions de commits

Format Conventional Commits : `type(scope): description courte #numéro-US`

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `chore` | Tâche technique sans impact fonctionnel (config, deps) |
| `docs` | Modification de documentation |
| `test` | Ajout ou modification de tests |
| `refactor` | Refactoring sans changement de comportement |
| `style` | Formatage, indentation (pas de logique) |

Exemples concrets sur ce projet :

```
feat(auth): ajout du formulaire d'inscription #1
feat(auth): envoi du code OTP via WhatsApp Baileys #2
feat(auth): vérification du code et activation du compte #2
feat(auth): crédit de 1h après vérification du numéro #5
fix(auth): correction de la redirection après connexion #3
feat(listing): création d'une annonce avec validation des champs #7
feat(listing): liste des annonces avec filtre par catégorie #10
feat(transaction): initiation d'une demande d'échange #12
feat(transaction): double validation et transfert d'heures #15
fix(transaction): blocage si solde insuffisant #15
chore: configuration ESLint et Prettier
chore: mise en place du pipeline CI GitHub Actions
docs: mise à jour du README avec les instructions d'installation
```

---

## Processus de Pull Request

**Avant d'ouvrir la PR :**
- Le code est complet et testé localement
- Le lint passe sans erreur (`npm run lint`)
- On a relu son propre code une fois avant de soumettre

**La PR doit contenir :**
- Un titre clair qui résume ce qui a été fait
- La référence à la US concernée (ex : "Closes #7")
- Une courte description de ce qui a changé si ce n'est pas évident

**Le relecteur vérifie :**
- La logique métier (notamment les règles de transaction)
- L'absence d'informations sensibles dans le code (.env, clés API)
- Le respect des conventions de nommage
- Que le lint passe côté CI

**Règle** : on ne merge pas sa propre PR. Au moins une approbation d'un autre membre est requise.

---

## Pourquoi pas Trunk-Based ?

Le Trunk-Based pousse à commiter directement sur main avec des branches très courtes (moins d'un jour). C'est l'approche que les études DORA recommandent pour aller vite. On ne l'a pas pris parce qu'il faut une vraie couverture de tests automatisés pour que main reste stable, et qu'on n'aura pas le temps de l'écrire sur une semaine.
