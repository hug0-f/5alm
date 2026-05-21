# syntax=docker/dockerfile:1.7

# --- Stage 1 : install des dependances ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 2 : build Next.js (standalone) ---
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Le client Prisma est genere automatiquement par "next build" via le postinstall,
# mais on l'appelle explicitement pour avoir un cache d'image deterministe.
RUN npx prisma generate
RUN npm run build

# --- Stage 3 : runtime minimal ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone embarque deja toutes les deps necessaires
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Prisma : schema + migrations pour pouvoir lancer "prisma migrate deploy" si besoin
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
