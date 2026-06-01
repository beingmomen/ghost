# Beingmomen Monorepo

pnpm workspace monorepo — 3 apps deployed independently on Coolify via Docker.

## Apps

| App | Path | Domain | Stack |
|-----|------|--------|-------|
| **client** | `apps/client` | [elshatory-web.beingmomen.com](https://elshatory-web.beingmomen.com) | Nuxt 4 (portfolio) |
| **server** | `apps/server` | [elshatory-api.beingmomen.com](https://elshatory-api.beingmomen.com) | Express.js (REST API) |
| **db** | `apps/db` | [elshatory-db.beingmomen.com](https://elshatory-db.beingmomen.com) | Nuxt 4 (admin dashboard) |

## Commands

```bash
# Dev — all 3 apps in one terminal (server → db → client), color-prefixed output.
# Uses `concurrently` with -k so Ctrl+C (or any app crashing) stops all three.
pnpm dev

# Dev — individually
pnpm dev:client     # port 3000 (overridable via apps/client/.env PORT)
pnpm dev:server     # port 1234 (overridable via apps/server/.env PORT)
pnpm dev:db         # port 9122

# Build
pnpm build:client
pnpm build:server
pnpm build:db
```

> **Note:** Running client + db together (both Nuxt) uses more RAM. On a constrained
> machine, prefer running fewer apps at a time. Ports come from each app's `.env`
> (`PORT`), so `pnpm dev` may show different ports than the defaults above.

> **Gotcha:** A crashed/leftover Nuxt session holds a dev lock — `pnpm dev` then fails
> with "Another Nuxt dev is already running". Fix: `NUXT_IGNORE_LOCK=1 pnpm dev`, or kill
> stale procs: `pkill -f "Beingmomen/apps/.*nuxt.mjs dev"`. Affects client + db (both Nuxt).

## Deployment

Each app has its own Dockerfile and deploys independently via Coolify on push to `main`.

**Auto-deploy triggers (watch_paths):**
- `apps/client/**` or `pnpm-lock.yaml` → redeploys client
- `apps/server/**` or `pnpm-lock.yaml` → redeploys server
- `apps/db/**` or `pnpm-lock.yaml` → redeploys db

**IMPORTANT — Deploy sequentially, never simultaneously.** Concurrent Nuxt builds exhaust VPS RAM (each needs ~4GB heap). If both client and db need redeploying, trigger one and wait for it to finish before triggering the other.

### Dockerfiles

- `apps/client/Dockerfile` — requires `python3 make g++` for `better-sqlite3`
- `apps/db/Dockerfile` — requires `GIGET_AUTH` build arg for GitHub base layer
- `apps/server/Dockerfile` — standard Node build

### Build-time Environment Variables

`apps/client` bakes `BASE_URL` into CSP headers at build time via `nuxt.config.ts`. This var must be set as **build-time** (not runtime-only) in Coolify, otherwise browser API calls will be blocked by CSP.

Required build-time vars for client: `BASE_URL`, `SITE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_URL`

## Stack

- **Runtime**: Node.js 20 + pnpm 10.29.3
- **Proxy**: Traefik + Let's Encrypt (SSL auto-managed)
- **Platform**: Coolify (self-hosted) at `coolify.beingmomen.com`
