# syntax=docker/dockerfile:1.7
FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Code
COPY server.js whatsapp.js ./

# Le repertoire auth_info est monte en volume par docker-compose pour persister
# la session Baileys entre les redemarrages. Au premier lancement, il est vide
# et le QR code s'affiche dans les logs.
RUN mkdir -p /app/auth_info
VOLUME ["/app/auth_info"]

ENV NODE_ENV=production
ENV WA_PORT=3001
EXPOSE 3001

# tty/stdin sont actives dans docker-compose pour que qrcode-terminal s'affiche
# correctement dans les logs.
CMD ["node", "server.js"]
