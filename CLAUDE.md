# Beingmomen Monorepo

pnpm workspace monorepo — 3 apps deployed independently on a CloudPanel VPS
(GitHub Actions self-hosted runner + PM2).

## Apps

| App | Path | Domain | Local port | Stack |
|-----|------|--------|-----------|-------|
| **client** | `apps/client` | [beingmomen.com](https://beingmomen.com) | 3000 | Nuxt 4 (portfolio) |
| **server** | `apps/server` | [api.beingmomen.com](https://api.beingmomen.com) | 3001 | Express.js (REST API) |
| **db** | `apps/db` | [db.beingmomen.com](https://db.beingmomen.com) | 9122 | Nuxt 4 (admin dashboard) |

> A previous Coolify deployment may still run as a backup on `elshatory-*.beingmomen.com`
> (a separate server). The live deployment is CloudPanel — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

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

Deployed on a **CloudPanel VPS** via a **GitHub Actions self-hosted runner** + **PM2**
(no Docker, no Coolify). On push to `main`, the runner syncs `/root/ghost`, writes each
app's `.env` from repo variables, and runs `scripts/deploy.sh`, which builds & restarts
**only the changed apps**. Full details: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

**Selective deploy (watch_paths equivalent, in `scripts/deploy.sh`):**
- `apps/client/**` → rebuilds client (port 3000)
- `apps/server/**` → restarts server (port 3001 — 1234 is taken on this shared VPS)
- `apps/db/**` → rebuilds db (port 9122)
- `pnpm-lock.yaml` → `pnpm install` + rebuilds all three

**IMPORTANT — builds run sequentially, never concurrently.** Two Nuxt builds at once
exhaust RAM (each needs ~4GB heap). `deploy.sh` builds client → db → server one at a
time. Do NOT parallelize it.

### Deployment files

- [ecosystem.config.cjs](ecosystem.config.cjs) — PM2 process defs + ports
- [scripts/deploy.sh](scripts/deploy.sh) — builds/restarts only changed apps, sequential
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — writes `.env` from repo variables, runs deploy.sh

### Environment Variables (repo variables → `.env`)

The workflow writes each app's `.env` from GitHub repository variables
`CLIENT_ENV_PROD` / `SERVER_ENV_PROD` / `DB_ENV_PROD` (each holds a full `.env`).

- **`BASE_URL` (client)** is baked into CSP headers at build time — `deploy.sh` sources
  `apps/client/.env` before building so it must live in `CLIENT_ENV_PROD`.
- **`GIGET_AUTH` (db)** fetches the private `beingmomen/base-layer` at build — lives in `DB_ENV_PROD`.
- These are currently **Variables** (readable). Moving them to **Secrets** is recommended.

## Architecture Migration — Nuxt Content → Backend API

### الوضع الحالي (تم تنفيذه جزئياً)

`@nuxt/content` و `better-sqlite3` تمّ حذفهم من `apps/client`. كانا يُستخدمان لتخزين وعرض 4 collections كملفات Markdown محلية:
- `agents` — إعدادات Claude Code agents
- `skills` — Claude Code skills وslash commands
- `commands` — Claude Code commands
- `mcp` — MCP server configurations

### المعمارية الجديدة المستهدفة

```
┌─────────────────────────────────────────────────────┐
│  apps/client (Nuxt 4 — Frontend)                    │
│  يقرأ البيانات من Backend API فقط                   │
│  لا يعتمد على أي قاعدة بيانات محلية                 │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (REST API)
┌────────────────────▼────────────────────────────────┐
│  apps/server (Express.js — Backend)                 │
│  يوفر CRUD API لكل الـ collections                  │
│  يخزن البيانات في MongoDB                           │
└────────────────────┬────────────────────────────────┘
                     │ Admin UI
┌────────────────────▼────────────────────────────────┐
│  apps/db (Nuxt 4 — Dashboard)                       │
│  إدارة كاملة للبيانات عبر الـ Backend API           │
└─────────────────────────────────────────────────────┘
```

### ما يحتاج migration في apps/client

الصفحات التالية **تم حذفها** من `apps/client` (الكود مش موجود أصلاً)؛ إعادة إضافتها لاحقًا تتطلب الربط بـ الـ Backend API:

| الصفحة | الحالة | المطلوب عند الإعادة |
|--------|--------|---------|
| `/agents` | محذوفة | ربط بـ `GET /api/v1/agents` |
| `/agents/[slug]` | محذوفة | ربط بـ `GET /api/v1/agents/:slug` |
| `/skills` | محذوفة | ربط بـ `GET /api/v1/skills` |
| `/skills/[slug]` | محذوفة | ربط بـ `GET /api/v1/skills/:slug` |
| `/commands` | محذوفة | ربط بـ `GET /api/v1/commands` |
| `/commands/[slug]` | محذوفة | ربط بـ `GET /api/v1/commands/:slug` |
| `/mcp` | محذوفة | ربط بـ `GET /api/v1/mcp` |
| `/mcp/[slug]` | محذوفة | ربط بـ `GET /api/v1/mcp/:slug` |

### Server API routes في apps/client (تم حذفها ✅)

الملفات التالية كانت تكتب/تحذف ملفات Markdown محلياً (dev-only) وقد **تم حذفها بالفعل** من `apps/client`:
- `server/api/agents.{post,delete}.ts`
- `server/api/commands.{post,delete}.ts`
- `server/api/mcp.{post,delete}.ts`
- `server/api/skills.{post,delete}.ts`
- `server/utils/markdown.ts`

وظيفة هذه الـ routes (CRUD للـ collections) ستُنقل إلى apps/db (Dashboard) عند استئناف الـ migration.

### خطوات الـ migration المطلوبة

1. **Backend (apps/server)**: إضافة models وroutes لـ agents، skills، commands، mcp
2. **Dashboard (apps/db)**: إضافة modules لإدارة الـ collections الأربعة
3. **Frontend (apps/client)**: استبدال `Promise.resolve([])` بـ `useAPI('/agents')` وما شابه
4. ~~حذف `server/api/{agents,skills,commands,mcp}.*.ts` و `server/utils/markdown.ts`~~ ✅ تم

## Stack

- **Runtime**: Node.js 24 (see `.nvmrc`) + pnpm 10.29.3
- **Proxy**: Traefik + Let's Encrypt (SSL auto-managed)
- **Platform**: Coolify (self-hosted) at `coolify.beingmomen.com`

## Design Context

Visual system documented in [`DESIGN.md`](DESIGN.md) (full spec) and [`.impeccable/design.json`](.impeccable/design.json) (machine-readable tokens + component snippets).

**North Star:** "الحضور الهادئ" (The Quiet Presence) — trust through execution, not declaration.

**Key rules for any agent touching `apps/client` UI:**
- Primary color: amber (`#fbbf24`). Text-use variant: `#d97706` (light mode). Max 3 amber moments per screen.
- Body: Tajawal 1.125rem / line-height 1.8 — Arabic baseline, non-negotiable.
- Display: Rubik (`font-display` class). Two font families only.
- Elevation: flat by default, shadow only for state (sticky nav, hover) or metaphor (polaroid).
- **Absolute bans:** gradient text, side-stripe card borders, SaaS hero-metrics template, cream/warm-tinted body background.
