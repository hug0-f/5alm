# Lebontroc

Plateforme web d'echange de services hyperlocal basee sur une monnaie de temps.
Aucun argent ne circule : une heure rendue vaut une heure recue, quel que soit le service.

Projet ALM M2 HESIAS. Hugo, Yanis, Thomas, Mohamed.

## Structure du depot

```
.
├── app/        Application Next.js (frontend + API routes)
├── service/    Microservice WhatsApp (Baileys) pour l'envoi des codes OTP
├── docs/       Referentiel ALM (cadrage, conception, tests, deploiement, etc.)
├── docker-compose.yml
└── README.md
```

## Stack

- Next.js 16 (App Router) + TypeScript 5
- TailwindCSS 4 + lucide-react
- PostgreSQL 18 (conteneur sur le VPS) + Prisma 7 (adapter `@prisma/adapter-pg`)
- NextAuth 5 (Credentials) + bcryptjs
- Baileys 6 (WhatsApp Web) pour l'envoi des codes de verification
- Docker + docker-compose pour le run local et le deploiement

## Prerequis

- Docker et Docker Compose
- (Optionnel pour dev sans Docker) Node.js 20+

## Demarrage avec Docker

1. Cloner le depot et creer les deux fichiers `.env` a partir des exemples :

   ```bash
   cp app/.env.example app/.env
   # editer app/.env (DATABASE_URL, NEXTAUTH_SECRET, etc.)
   ```

2. Lancer la stack :

   ```bash
   docker compose up --build
   ```

3. **Premier demarrage uniquement** : la base PostgreSQL demarre vide, il faut
   appliquer les migrations Prisma une fois. Depuis le dossier `app/` :

   ```bash
   docker run --rm --network lebontroc_default --env-file .env \
     -v "$PWD":/work -w /work node:20-alpine \
     sh -c "npm ci && npx prisma migrate deploy"
   ```

   Les donnees sont ensuite persistees dans le volume `lebontroc_db_data` et
   survivent aux redemarrages.

4. Au **premier demarrage**, le service WhatsApp affiche un QR code dans les logs.
   Ouvrir WhatsApp sur le telephone qui servira d'expediteur : **Reglages > Appareils
   lies > Lier un appareil**, puis scanner le QR. La session est ensuite persistee
   dans le volume Docker `wa_auth` et n'a plus a etre rescannee aux redemarrages.

   Si compose tourne en arriere-plan :

   ```bash
   docker compose logs -f wa-service
   ```

5. Acces :
   - App Next.js : http://localhost:5000 (port hote 5000 mappe sur 3000 dans le conteneur)
   - Service WhatsApp et base PostgreSQL : internes au reseau Docker (pas exposes sur l'hote)

Pour repartir d'une session WhatsApp vierge :

```bash
docker compose down
docker volume rm lebontroc_wa_auth
docker compose up --build
```

## Demarrage sans Docker (dev local)

```bash
# Service WhatsApp
cd service
npm install
npm start                # affiche le QR code au premier lancement

# Application Next.js (dans un autre terminal)
cd app
npm install
npm run dev              # http://localhost:3000
```

## Variables d'environnement

Voir `app/.env.example`. Les principales :

| Variable           | Description                                        |
|--------------------|----------------------------------------------------|
| `POSTGRES_USER`    | Utilisateur de la base (lu par le conteneur `db`)  |
| `POSTGRES_PASSWORD`| Mot de passe de la base                            |
| `POSTGRES_DB`      | Nom de la base                                     |
| `DATABASE_URL`     | URL PostgreSQL (conteneur `db`, memes identifiants que ci-dessus) |
| `DATABASE_SSL`     | `true` seulement pour une base distante avec SSL, vide en local |
| `NEXTAUTH_SECRET`  | Secret NextAuth (`openssl rand -base64 32`)        |
| `AUTH_SECRET`      | Identique a `NEXTAUTH_SECRET` (NextAuth v5)        |
| `NEXTAUTH_URL`     | URL publique de l'app                              |
| `AUTH_TRUST_HOST`  | `true` derriere un reverse-proxy                   |
| `WA_SERVICE_URL`   | URL du microservice WhatsApp (`http://wa-service:3001` en Docker) |

## Commandes utiles

```bash
# App
cd app && npm run dev          # serveur de developpement
cd app && npm run lint         # analyse statique
cd app && npm run build        # build de production

# Prisma
cd app && npx prisma migrate dev
cd app && npx prisma studio

# Docker
docker compose up --build
docker compose logs -f wa-service
docker compose down
```

## Fonctionnalites livrees

- Inscription avec verification du numero par WhatsApp (code OTP 6 chiffres, valable 10 min)
- Connexion via NextAuth (Credentials), sessions JWT
- Credit automatique d'une heure a la verification du numero
- Publication, modification, suppression et filtrage d'annonces (categorie, code postal)
- 20 categories illustrees (icones lucide)
- Reservation d'un service, double validation des deux parties, transfert atomique
  des heures (F4 : US-012 a US-016)
- Historique des transactions accessible depuis "Mes echanges"
- Anti auto-echange (impossible de reserver sa propre annonce)
- Refus d'une demande par le prestataire avant finalisation

## A venir

- F3 Messagerie (US-017 a US-019) : echanges entre membres autour d'une annonce
- Notation post-transaction (US-021 a US-023, Could Have)
