FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

FROM base AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/
COPY apps/db/package.json ./apps/db/
RUN pnpm install --frozen-lockfile --filter ./apps/client

FROM deps AS builder
ENV NODE_OPTIONS=--max-old-space-size=4096
COPY apps/client/ ./apps/client/
RUN pnpm --filter nuxt-ui-template-portfolio build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/client/.output ./.output
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", ".output/server/index.mjs"]
