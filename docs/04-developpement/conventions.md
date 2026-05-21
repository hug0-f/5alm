# Conventions de code: Lebontroc

## Outils de qualité

**ESLint** : analyse le code à la recherche d'erreurs et de mauvaises pratiques avant même d'exécuter le projet. Il est configuré pour Next.js et s'exécute avec `npm run lint`. Le pipeline CI bloque le merge si ESLint échoue.

**Prettier** : formate automatiquement le code (indentation, guillemets, virgules) pour que tout le monde ait le même style, peu importe l'éditeur utilisé. On ne discute pas du formatage, Prettier décide.

---

## Nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Composants React | PascalCase | `ListingCard.tsx`, `TransactionModal.tsx` |
| Fichiers utilitaires | camelCase | `formatDate.ts`, `validatePhone.ts` |
| Fichiers de page Next.js | kebab-case | `mes-annonces/page.tsx` |
| Variables et fonctions | camelCase | `userBalance`, `handleSubmit` |
| Constantes globales | SCREAMING_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Types et interfaces TypeScript | PascalCase | `type Transaction`, `interface UserProfile` |
| Tables en base de données | snake_case | `users`, `listings`, `transactions` |
| Colonnes en base de données | snake_case | `created_at`, `is_verified`, `phone_number` |

---

## Structure des dossiers

```
src/
  app/                  # Pages Next.js (App Router)
    connexion/          # Page de connexion
    inscription/        # Page d'inscription
    verification/       # Saisie du code OTP
    dashboard/          # Tableau de bord utilisateur connecté
    annonces/           # Liste, détail, création et édition d'annonces
    mes-annonces/       # Annonces de l'utilisateur connecté
    transactions/       # Liste et détail des transactions
    api/                # Routes API Next.js
      auth/  register/  verify/  resend/
      listings/  transactions/
  auth.ts               # Configuration NextAuth (sessions JWT)
  components/           # Composants réutilisables
    ui/                 # Composants génériques (Button, Input, Card...)
  lib/                  # Fonctions utilitaires et services
    prisma.ts           # Client Prisma (ORM + connexion PostgreSQL)
    whatsapp.ts         # Appel HTTP vers le service wa-service
    api.ts              # Helpers de routes (auth, erreurs, garde same-origin)
    rate-limit.ts       # Rate limiting en mémoire
    *-validation.ts     # Validation des entrées (annonces, transactions...)
    __tests__/          # Tests unitaires Jest de la logique pure
  types/                # Types TypeScript partagés
```

Les composants sont à plat dans `components/`, sauf les composants génériques regroupés dans `components/ui/`.

---

## Règles générales

- TypeScript strict activé : pas de `any` sans justification commentée
- Les appels à la base de données se font uniquement dans les routes API, jamais directement dans les composants
- Les variables d'environnement sont toujours lues depuis `process.env` et jamais codées en dur
- Un composant = un fichier. Pas de composants géants qui font tout
- Les messages d'erreur retournés par l'API sont en français (c'est l'interface utilisateur)

---

## Configuration Prettier

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```
