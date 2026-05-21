# Environnement de développement: Lebontroc

## Prérequis

- Docker et Docker Compose (la base PostgreSQL tourne en conteneur)
- Node.js 20 ou supérieur, npm 10 ou supérieur (pour le dev hors Docker)
- Le mot de passe de la base et le secret NextAuth, à demander à l'équipe

## Installation

Le dépôt contient deux projets Node distincts : `app/` (Next.js) et `service/` (wa-service Baileys).

```bash
git clone https://github.com/hug0-f/5alm-myth.git
cd 5alm-myth

# Dépendances de l'app
cd app && npm install

# Dépendances du service WhatsApp
cd ../service && npm install
```

## Variables d'environnement

Créer un fichier `app/.env` à partir de `app/.env.example` :

```
POSTGRES_USER=lebontroc
POSTGRES_PASSWORD=mot-de-passe-fort
POSTGRES_DB=lebontroc
DATABASE_URL=postgresql://lebontroc:mot-de-passe-fort@db:5432/lebontroc
DATABASE_SSL=                        # vide en local
NEXTAUTH_SECRET=une-chaine-aleatoire # openssl rand -base64 32
AUTH_SECRET=une-chaine-aleatoire
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
WA_SERVICE_URL=http://wa-service:3001
```

Le mot de passe doit être identique dans `POSTGRES_PASSWORD` et dans
`DATABASE_URL`. Ce fichier est dans le `.gitignore`, on ne le committe jamais.

## Base de données

La base PostgreSQL tourne dans le conteneur `db` du `docker-compose`. Au
premier démarrage elle est vide : il faut appliquer les migrations Prisma une
fois, depuis le dossier `app/` :

```bash
docker run --rm --network lebontroc_default --env-file .env \
  -v "$PWD":/work -w /work node:20-alpine \
  sh -c "npm ci && npx prisma migrate deploy"
```

Les données sont ensuite persistées dans le volume `lebontroc_db_data`.

## Service WhatsApp (wa-service)

Les codes de vérification passent par un service Node séparé qui utilise Baileys pour parler à WhatsApp. Ce service tourne sur le VPS, en conteneur Docker.

Pour le démarrer en local :

```bash
cd service
npm start    # affiche un QR code au premier démarrage
```

Scanner le QR avec WhatsApp (Paramètres > Appareils liés) sur le téléphone dédié. La session est persistée dans `auth_info/` et restaurée automatiquement au redémarrage.

## Lancer le projet en développement

```bash
cd app
npm run dev   # http://localhost:3000
```

## Lint

```bash
cd app
npm run lint
```

Le lint doit passer avant d'ouvrir une PR : le CI le bloque sinon.

## Build de production

```bash
cd app
npm run build
```

Sert à vérifier que ça compile avant de merger sur main.

## Stack utilisée

| Outil | Rôle | Version |
|-------|------|---------|
| Next.js | Framework full-stack | 16 |
| TypeScript | Typage statique | 5 |
| TailwindCSS | Styles | 4 |
| lucide-react | Icônes | latest |
| PostgreSQL | Base de données | 18 |
| Prisma | ORM | 7 |
| NextAuth.js | Authentification et sessions | 5 (beta) |
| Baileys | Client WhatsApp Web (envoi des codes OTP) | 6 |
| Docker + Docker Compose | Conteneurisation et orchestration des services | latest |

## Usage de Claude Code

On utilise Claude Code pour le code : scaffolding des routes API, vérification OTP, migration WhatsApp/Baileys, fichiers de configuration. Chaque morceau généré est relu et validé par un membre avant merge. Détails dans `usage-ia.md`.
