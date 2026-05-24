FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate && \
    apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/
COPY apps/db/package.json ./apps/db/
RUN pnpm install --frozen-lockfile --prod --filter ./apps/server

COPY apps/server/ ./apps/server/
WORKDIR /app/apps/server
EXPOSE 1234
ENV NODE_ENV=production
CMD ["node", "server.js"]
