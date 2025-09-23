FROM node:current-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV PAYLOAD_SECRET="my-super-cool-secret"
ENV DATABASE_URI="file:./db.sqlite3"
ENV NEXT_TELEMETRY_DISABLED=1
RUN mv ./db.sqlite3.example ./db.sqlite3
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
 # Ensure libsql native bindings are available at runtime
COPY --from=builder /app/node_modules/libsql ./node_modules/libsql
COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql

EXPOSE 3000
VOLUME /app/db.sqlite3 
VOLUME /app/public/media
VOLUME /app/public/coverImage

ENV PORT=3000
ENTRYPOINT ["node", "server.js"]