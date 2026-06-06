# Beingmomen Monorepo

pnpm workspace monorepo containing 3 apps deployed on Coolify.

## Apps

| App | Path | Domain | Description |
|-----|------|--------|-------------|
| **client** | `apps/client` | [elshatory-web.beingmomen.com](https://elshatory-web.beingmomen.com) | Portfolio website (Nuxt 4) |
| **server** | `apps/server` | [elshatory-api.beingmomen.com](https://elshatory-api.beingmomen.com) | REST API (Express) |
| **db** | `apps/db` | [elshatory-db.beingmomen.com](https://elshatory-db.beingmomen.com) | Admin dashboard (Nuxt 4) |

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
