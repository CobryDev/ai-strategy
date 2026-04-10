FROM node:20-alpine AS deps
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
RUN apk add --no-cache git
WORKDIR /repo

COPY .git .git

WORKDIR /repo/app
COPY app/ .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_PUBLIC_GITHUB_REPO=CobryDev/ai-strategy
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /repo/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /repo/app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /repo/app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
