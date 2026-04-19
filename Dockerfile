FROM docker.io/oven/bun:1.3-alpine AS builder

WORKDIR /app

COPY bun.lock ./
COPY package.json ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bun run build

FROM docker.io/oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public

CMD ["bun", "server.js"]
