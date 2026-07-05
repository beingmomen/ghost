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

Each app has its own Dockerfile and deploys independently via Coolify's built-in
**Auto Deploy** on push to `main`. A private GitHub App (`comfortable-capuchin-z122lc1l6`)
sends the push webhook; Coolify filters by each app's watch_paths. No GitHub Actions.
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

**Auto-deploy triggers (watch_paths):**
- `apps/client/**` or `pnpm-lock.yaml` → redeploys client
- `apps/server/**` or `pnpm-lock.yaml` → redeploys server
- `apps/db/**` or `pnpm-lock.yaml` → redeploys db

**IMPORTANT — builds must never run concurrently.** Concurrent Nuxt builds exhaust
VPS RAM (each needs ~4GB heap). This is enforced by the Coolify server setting
`concurrent_builds = 1`, which queues builds one at a time even when one push touches
multiple apps. Do NOT raise it.

### Dockerfiles

- `apps/client/Dockerfile` — standard Node build (better-sqlite3 removed)
- `apps/db/Dockerfile` — requires `GIGET_AUTH` build arg for GitHub base layer
- `apps/server/Dockerfile` — standard Node build

### Build-time Environment Variables

`apps/client` bakes `BASE_URL` into CSP headers at build time via `nuxt.config.ts`. This var must be set as **build-time** (not runtime-only) in Coolify, otherwise browser API calls will be blocked by CSP.

Required build-time vars for client: `BASE_URL`, `SITE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_URL`

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

الصفحات التالية معطّلة مؤقتاً (تعرض empty state) حتى يكتمل الـ migration:

| الصفحة | الحالة | المطلوب |
|--------|--------|---------|
| `/agents` | empty state | ربط بـ `GET /api/v1/agents` |
| `/agents/[slug]` | 404 | ربط بـ `GET /api/v1/agents/:slug` |
| `/skills` | empty state | ربط بـ `GET /api/v1/skills` |
| `/skills/[slug]` | 404 | ربط بـ `GET /api/v1/skills/:slug` |
| `/commands` | empty state | ربط بـ `GET /api/v1/commands` |
| `/commands/[slug]` | 404 | ربط بـ `GET /api/v1/commands/:slug` |
| `/mcp` | empty state | ربط بـ `GET /api/v1/mcp` |
| `/mcp/[slug]` | 404 | ربط بـ `GET /api/v1/mcp/:slug` |

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
