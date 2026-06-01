# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

FROM base AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/
COPY apps/db/package.json ./apps/db/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter ./apps/client

FROM deps AS builder
ARG BASE_URL
ARG SITE_URL
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_URL
ENV BASE_URL=$BASE_URL
ENV SITE_URL=$SITE_URL
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_URL=$CLOUDINARY_URL
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV NUXT_TELEMETRY_DISABLED=1
COPY apps/client/ ./apps/client/
RUN pnpm --filter nuxt-ui-template-portfolio build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/client/.output ./.output
EXPOSE 3000
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=2048
CMD ["node", ".output/server/index.mjs"]
