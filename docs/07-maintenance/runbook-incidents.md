# Runbook incidents Lebontroc

*Procédure à suivre en cas d'alerte ou d'incident en production. Stack : docker-compose (app Next.js + wa-service Baileys + PostgreSQL) sur VPS OVH `vps1.xernex.fr`, tunnel Cloudflare vers lebontroc.xernex.fr.*

---

## 0. Premiers réflexes

1. Vérifier l'URL publique : https://lebontroc.xernex.fr
2. Ouvrir le dashboard Grafana (privé) `grafana.new-teleport.xernex.fr` : repérer toute alerte `firing` (cf. règles documentées dans [plan-maintenance.md](plan-maintenance.md))
3. Se connecter au VPS : `ssh debian@vps1.xernex.fr` depuis une IP sécurisée
4. État des conteneurs : `docker compose ps`
5. Logs en direct : `docker compose logs -f --tail=200`
6. Health wa-service : `docker compose exec wa-service wget -qO- http://localhost:3001/api/health`

Si l'incident touche un utilisateur, prévenir l'équipe sur le canal projet avant de toucher quoi que ce soit.

---

## 1. Site inaccessible (lebontroc.xernex.fr ne répond pas)

**Symptômes** : 502/504, page blanche, timeout. Souvent corrélé à l'alerte Grafana `Node DOWN`.

**Diagnostic**
```bash
docker compose ps                       # conteneurs up ?
docker compose logs --tail=100 app      # erreurs au boot ?
curl -I http://localhost:5000           # le conteneur répond en local ?
```

**Actions**
- Si `app` est `Restarting` ou `Exited` : `docker compose logs app` puis `docker compose up -d app`.
- Si le conteneur tourne mais ne répond pas : `docker compose restart app`.
- Si l'app répond en local mais pas via le domaine : problème côté Cloudflare tunnel. Vérifier `cloudflared` sur le VPS (`systemctl status cloudflared`).
- Dernier recours : `docker compose up -d --build` pour reconstruire l'image.

---

## 2. wa-service down (codes OTP non envoyés)

**Symptômes** : l'inscription remonte "Erreur service WhatsApp", `/api/health` répond `not_ready`.

**Diagnostic**
```bash
docker compose logs --tail=200 wa-service
```

**Cas A : reconnexion en boucle**
Souvent un blip réseau. Attendre 30 secondes, le code de `connect()` se relance automatiquement.

**Cas B : `loggedOut` dans les logs**
La session Baileys a été révoquée (déconnexion manuelle depuis le téléphone, ou expiration). Il faut rescanner le QR — procédure chirurgicale qui ne coupe pas `app` ni `db` :
```bash
docker compose stop wa-service
docker compose rm -f wa-service          # libère la référence au volume
docker volume rm lebontroc_wa_auth
docker compose up -d wa-service
docker compose logs -f wa-service        # afficher le QR
```
Puis Réglages WhatsApp > Appareils liés > Lier un appareil.

**Cas C : container démarre mais reste en `not_ready`**
```bash
docker compose restart wa-service
```
Si le problème persiste après redémarrage, c'est probablement la session Baileys corrompue : appliquer le Cas B.

**Cas D : erreurs Baileys v7 après re-pairing**
Si les logs montrent `critical_block blocked on missing key … from v0` ou `dropping spoofed self-only protocolMessage from non-self origin` : c'est lié à la migration LID de WhatsApp gérée par Baileys v7-rc. Le premier indique un auth state incomplet → refaire un wipe volume (Cas B) en s'assurant que le conteneur est bien `rm -f` avant `volume rm`. Le second est un warn non-bloquant qui se stabilise après quelques minutes. Voir [docs Baileys v7](https://whiskey.so/migrate-latest).

**Important** : pendant l'incident, l'inscription est cassée mais la connexion des comptes déjà vérifiés marche toujours. Le communiquer aux utilisateurs si l'incident dure.

---

## 3. Erreurs de base de données

**Symptômes** : 500 sur toutes les routes, logs `app` avec `PrismaClientInitializationError`, `ECONNREFUSED`, ou `password authentication failed`.

**Diagnostic**
```bash
docker compose ps db                                # le conteneur db tourne-t-il ?
docker compose logs --tail=100 db
docker compose exec db pg_isready -U lebontroc      # la base accepte les connexions ?
docker compose logs --tail=100 app | grep -i prisma
```

**Actions**
- Si le conteneur `db` est `Exited` ou `Restarting` : `docker compose logs db` pour voir la cause (souvent volume corrompu ou disque plein → §5), puis `docker compose up -d db`.
- Si auth refusée (`password authentication failed`) : le mot de passe a divergé entre `app/.env` et la base. Vérifier que `DATABASE_URL` dans `app/.env` correspond à `POSTGRES_PASSWORD` côté `db`, puis `docker compose up -d app`.
- Si la base est corrompue (erreurs de cohérence dans les logs) : restaurer le dernier dump (voir section *Sauvegardes* du [plan de maintenance](plan-maintenance.md)).
- Si saturation de connexions : redémarrer l'app (`docker compose restart app`) libère le pool.

---

## 4. Déploiement GitHub Actions échoué

**Symptômes** : badge CI rouge, le commit sur `main` n'a pas atterri en prod.

**Diagnostic**
- Onglet Actions du repo : identifier le job qui a échoué (`ci` ou `deploy`).
- Job `ci` : échec de lint/build. Reproduire en local avec `cd app && npm ci && npm run lint && npm run build`.
- Job `deploy` (self-hosted runner) : vérifier que le runner tourne sur le VPS.

**Actions runner KO sur le VPS**
```bash
ssh debian@vps1.xernex.fr
cd ~/actions-runner
sudo ./svc.sh status
sudo ./svc.sh start                     # si arrêté
```

**Déploiement manuel de secours**
```bash
ssh debian@vps1.xernex.fr
cd /home/debian/5alm
git pull origin main
docker compose up -d --build
docker image prune -f
```

---

## 5. Disque plein sur le VPS

**Symptômes** : `no space left on device` dans les logs, deploy qui crashe pendant le `docker build`. Anticipé par les alertes Grafana `Disque presque plein` (volume principal) et `Disque boot plein` (`/boot/firmware`).

**Diagnostic**
```bash
df -h
docker system df
```

**Actions**
```bash
docker image prune -af                  # images non utilisées
docker container prune -f               # conteneurs arrêtés
docker volume prune -f                  # volumes orphelins (uniquement les non-rattachés, lebontroc_wa_auth et db_data restent safe tant que les conteneurs tournent)
docker builder prune -af                # cache de build
journalctl --vacuum-time=7d             # logs système plus vieux que 7 jours
```

Si la partition `/boot/firmware` est pleine (alerte `Disque boot plein`) : `sudo apt autoremove --purge` pour supprimer les anciens kernels.

---

## 6. Pic d'erreurs 4xx/5xx ou app lente

Souvent corrélé aux alertes Grafana `CPU élevé`, `RAM élevée`, `Charge système élevée` ou `I/O wait élevé`.

**Diagnostic**
```bash
docker stats --no-stream                # CPU/RAM par conteneur
docker compose logs --tail=300 app | grep -E "error|500"
```

**Actions**
- Si mémoire saturée sur `app` : c'est probablement la `Map` du rate-limit qui a grossi entre deux deploys, ou une fuite. Redémarrer `app` libère la mémoire (`docker compose restart app`).
- Si CPU saturé sur `wa-service` : la reconnexion Baileys peut être en boucle, voir section 2.
- Pic d'erreurs sur `/api/register` : possible attaque énumération. Vérifier les IP dans les logs, bloquer au niveau Cloudflare si nécessaire.

---

## 7. Tableau d'escalade

| Problème | Premier responsable | Si indisponible |
|----------|---------------------|-----------------|
| VPS, Docker, déploiement | Hugo (propriétaire repo) | Mohamed |
| wa-service, Baileys | Yanis | Thomas |
| App Next.js, Prisma | Thomas | Hugo |
| Cloudflare tunnel, DNS | Hugo | Mohamed |
| PostgreSQL (conteneur `db`, dumps) | Hugo | Thomas |

---

## 8. Après l'incident

1. Noter dans `docs/07-maintenance/` la date, le symptôme, la cause racine et le fix appliqué.
2. Si l'incident a duré plus de 30 minutes ou a touché des utilisateurs : courte post-mortem (5 lignes : ce qui s'est passé, pourquoi, comment on a corrigé, ce qu'on change pour que ça ne revienne pas).
3. Si une dette technique a été révélée (exemple : rate-limit qui saute au restart) : créer une issue GitHub avec le label `tech-debt`.

---

## 9. Commandes de référence rapide

| Action | Commande |
|--------|----------|
| Voir les conteneurs | `docker compose ps` |
| Logs app, 200 dernières lignes | `docker compose logs --tail=200 app` |
| Suivre les logs en direct | `docker compose logs -f` |
| Redémarrer un service | `docker compose restart <service>` |
| Reconstruire et relancer | `docker compose up -d --build` |
| Tout arrêter | `docker compose down` |
| Health wa-service | `docker compose exec wa-service wget -qO- http://localhost:3001/api/health` |
| Logs wa-service en direct (pour QR) | `docker compose logs -f --tail=100 wa-service` |
| Inspecter le volume Baileys | `docker volume inspect lebontroc_wa_auth` |
| Espace disque | `df -h` et `docker system df` |
| Pg connectivité | `docker compose exec db pg_isready -U lebontroc` |

*Lebontroc, projet ALM M2 HESIAS, 2025-2026.*
