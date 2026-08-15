# Beingmomen Monorepo

pnpm workspace monorepo containing 3 apps deployed on Coolify.

## Overview

The codebase behind [beingmomen.com](https://beingmomen.com) — my portfolio,
its REST API, and the admin dashboard I use to manage its content.

Built as a pnpm workspace so the three apps share tooling and a single
lockfile, while each deploys independently: a push that only touches
`apps/client` won't rebuild the API. Self-hosted on a VPS with Coolify
and Traefik rather than a managed platform, which keeps SSL, routing,
and process management under my control.

Arabic-first with full RTL support throughout.

## Apps

| App        | Path          | Description                                                                                    |
| ---------- | ------------- | ---------------------------------------------------------------------------------------------- |
| **client** | `apps/client` | Portfolio — Nuxt 4, live at [beingmomen.com](https://beingmomen.com)                           |
| **server** | `apps/server` | REST API — Express                                                                             |
| **db**     | `apps/db`     | Admin dashboard — Nuxt 4. Content management for the portfolio: projects, blog posts, and ADRs |

![Beingmomen](apps/client/public/image.png)

## Development

```bash
pnpm dev:client    # Portfolio — port 3000
pnpm dev:server    # API — port 1234
pnpm dev:db        # Dashboard — port 9122
```

## Build

```bash
pnpm build:client
pnpm build:server
pnpm build:db
```

## Deployment

Each app deploys independently via Coolify on push to `main`. Auto-deploy triggers:

- `apps/client/**` or `pnpm-lock.yaml` → redeploys client
- `apps/server/**` or `pnpm-lock.yaml` → redeploys server
- `apps/db/**` or `pnpm-lock.yaml` → redeploys db

## Stack

- **Runtime**: Node.js 24 (see `.nvmrc`) + pnpm 10
- **Frontend**: Nuxt 4, Nuxt UI v4, Tailwind CSS v4
- **Backend**: Express.js
- **Proxy**: Traefik + Let's Encrypt (SSL)
- **Platform**: Coolify (self-hosted)
