# Repo Map — Beingmomen Monorepo

## Stacks detected
- **apps/client** (111 files) — Nuxt 4 portfolio (Vue 3, Nuxt UI 4, Tailwind v4). Mostly `.vue` + some `.ts`/`.js`. Reads data from backend API. Has Nitro server routes under `apps/client/server/`.
- **apps/server** (118 files) — Express.js 4 REST API, **all JavaScript (.js)**, MongoDB via Mongoose 8. JWT auth (httpOnly cookie), Cloudinary uploads, nodemailer + pug emails, sharp/multer image pipeline.
- **apps/db** (213 files) — Nuxt 4 admin dashboard. Extends a base-layer (`github:beingmomen/base-layer` or local). Uses `nuxt-auth-utils`. CRUD services per collection. Playwright present.

Root: pnpm workspace (`pnpm@10.29.3`), Node 24 (`.nvmrc`). Deploy via Coolify/Docker, Traefik proxy.

## In-scope boundary
IN: `apps/{client,server,db}/**` (excluding their node_modules/.nuxt/.output/dist), root `package.json`, `pnpm-workspace.yaml`, project docs.
OUT (exclude): `node_modules/`, `.nuxt/`, `.output/`, `dist/`, lockfiles, AND tooling dirs `.agents/`, `.claude/`, `.impeccable/`, `skills-lock.json`, `hand-offs/`, `reports/`, `audit-reports/` — these are agent/skill tooling, not the audited product.

## Documentation sources (axis 1)
- Root: `README.md`, `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md`, `docs/` (esp. `docs/DEPLOYMENT.md`, `docs/IMPROVEMENTS.md`, `docs/STATIC_DATA_REPORT.md`)
- Per-app: `apps/client/CLAUDE.md`, `apps/server/CLAUDE.md`, `apps/db/CLAUDE.md`, any per-app README
- Env templates: `.env.example` (root + each app)
- `learning-roadmap-feature-spec.md` (root) — note: a recent commit "remove learning roadmap feature" from client; server still has roadmap models/routes/controllers — check for doc/code drift.

## Server entry points & shape
- Bootstrap: `apps/server/server.js` → `apps/server/app.js` (middleware stack) → `routes/` → `controllers/` → `models/`
- Controllers: resource controllers prefixed `_` (e.g. `_blogController.js`), plus `authController.js`, `handlerFactory.js` (generic CRUD), `errorController.js`, `landingController.js`, `roadmapController.js`, `buildProjectController.js`
- 18 route files in `routes/`, 20 models in `models/` (incl. roadmap* and counterPlugin)
- Image pipeline: `imageServices/` (multer memory storage → sharp → Cloudinary, fallback `public/images/`)
- Validators: `middleware/validators/`

## Client entry points
- `apps/client/nuxt.config.ts` (routeRules, CSP headers, runtimeConfig)
- Pages under `apps/client/app/pages/`, composables `app/composables/`, Nitro routes `server/api/`, `server/routes/`
- Data flow: Pages → composables (`useAPI`/`useApiRequest`) → `$api` plugin → backend API

## DB dashboard entry points
- `apps/db/nuxt.config.ts` (layer extends), `app/composables/services/*`, pages, `nuxt-auth-utils` session

## Notes / known context (from prior review this session)
- routeRules + `blog.get.js` were just edited on branch `fix/render-route-rules` (not committed).
- Known prior flags: CSP has `'unsafe-eval'`; server fully `.js`; `@nuxt/ui` version drift (client 4.5.1 vs db 4.6.1); `packageManager` drift; `ngrok` in server deps; dual eslint configs in server.
</content>
</invoke>
