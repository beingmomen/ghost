# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arabic RTL dashboard application built with Nuxt 4 + Vue 3 Composition API. Consumes an external REST API. Extends a shared base layer at `../my-base-layer` (or via GitHub) that provides auth, layouts, base components, and core composables.

Deployed via Coolify (Docker). Pushes to `main` that touch `apps/db/**` or `pnpm-lock.yaml` trigger an automatic redeploy via Coolify's built-in **Auto Deploy** (GitHub App webhook + watch paths). See [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md).

## Commands

```bash
pnpm dev              # Start dev server on port 9122
pnpm build            # Production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm typecheck        # Type check with vue-tsc
pnpm sync-deps        # Sync dependencies from base layer, then run pnpm install
```

### Development Workflow

- **Branch**: Work on feature branches off `main` and merge via PR.
- **CI/CD**: Pushes to `main` trigger Coolify redeploys via built-in Auto Deploy (only when watched paths change).
- **Production URL**: https://elshatory-db.beingmomen.com

## Architecture

### Module Pattern

Every feature (blog, clients, contacts, projects, resources, services, skills, testimonials, users, infos) follows the same structure.

**Image handling**: Use `normalizeAvatarSrc()` from base layer in `columns.js` and `form.js` to convert backend image paths to proxy-routable `/api/...` URLs. Do NOT create custom URL resolution utilities — the base layer handles all image proxy routing. See **Security** section below for host whitelist policy.

Module structure:

**Composables** — `app/composables/modules/<module>/`:
- `schema.js` — Zod validation schema (Arabic error messages via `zod-arabic` plugin)
- `form.js` — Reactive form state, `resetForm()`, `prepareSubmitData()`
- `columns.js` — TanStack table column definitions
- `table.js` — CRUD operations, pagination, cache management via `useNuxtData(CACHE_KEY)`
- `actions.js` — Form submission and editing logic
- `index.js` — Combines and re-exports all above

**Service** — `app/composables/services/<module>.js`:
- Uses `useBaseService()` from base layer (`get`, `create`, `patch`, `remove`, `loading`)
- Defines `BASE_URL` and `CACHE_KEY`

**Components** — `app/components/modules/<module>/`:
- `<Module>Form.vue` — Create/edit form using `BaseForm`, `BaseInput`, `BaseCard`, `BaseFormField`
- `<Module>Table.vue` — Data table using `BasePaginatedTable`, `BaseDelete`

**Pages** — `app/pages/<module>/`:
- `index.vue` — List view with table
- `[id].vue` — Create/edit form (except `contacts` which is read-only)

### Base Layer (Source of Truth)

**Path**: `/media/beingmomen/Code/personal/Temp/my-base-layer`
**IMPORTANT**: Always read the actual base layer source files at this path before using or suggesting Base* components, composables, or utilities. This ensures you use the correct props, slots, emits, and patterns.

> **Comprehensive Nuxt Layers reference:** See base layer's [docs/nuxt-layers-guide.md](/media/beingmomen/Code/personal/Temp/my-base-layer/docs/nuxt-layers-guide.md) for complete layer behavior, dependency management rules (why deps must be duplicated), server directory behavior, and common pitfalls.

**Components** (`/app/components/base/`):
- **Form**: `BaseForm`, `BaseFormField`
- **Inputs**: `BaseInput`, `BasePassword`, `BaseNumber`, `BaseCurrency`, `BaseSelect`, `BaseFileUpload`, `BaseInputTags`
- **Selection**: `BaseCheckbox`, `BaseSwitch`
- **Layout**: `BaseCard`
- **Tables**: `BaseTable`, `BasePaginatedTable`
- **Actions**: `BaseDelete`, `BaseConfirm`

**Composables** (`/app/composables/`):
- **Services**: `useBaseService()` — `get`, `create`, `update`, `patch`, `remove`, `loading`
- **Core**: `useGlobal()`, `useErrorHandler()`, `useAvatar()`, `normalizeAvatarSrc()`, `useAPI()`
- **Auth**: `useAuth()` (from `@sidebase/nuxt-auth`), `useLogin()`, `useSignup()`, `useForgotPassword()`, `useResetPassword()`
- **Layout**: `useNavbar()`, `useSidebar()`, `useAppearance()`

**Utilities** (`/app/utils/`): `toFormData()`, `downloadFile()`, `downloadUrl()`

**Server Proxy** (from base layer):
- `proxyToBackend()` — API endpoints (uses full `apiBase` path)
- `proxyStaticToBackend()` — Static assets like images (uses backend origin only, no `/api/v1`)
- Config: `proxyAllowedPrefixes` (API paths) + `proxyStaticPrefixes` (static paths, default: `/images`)

**Layouts**: `default.vue` (dashboard), `auth.vue` (authentication)

### Implemented Modules

Currently deployed modules (in `app/composables/modules/`):
- **blog** — Blog posts with full CRUD
- **clients** — Client management
- **contacts** — Contact information (read-only, no create/edit page)
- **infos** — General information
- **projects** — Project portfolio
- **resources** — Resources/links
- **services** — Service offerings
- **skills** — Skills listing
- **testimonials** — Customer testimonials
- **users** — User management (if applicable)

Each module follows the same pattern (see below).

### Adding a New Module

1. Create service: `app/composables/services/<module>.js`
2. Create module composables: `app/composables/modules/<module>/` (schema, form, columns, table, actions, index)
3. Create components: `app/components/modules/<module>/` (Form + Table)
4. Create pages: `app/pages/<module>/` (index.vue + [id].vue)
5. Add sidebar link in `app/composables/layout/sideBar/index.js`

### State Management

No Pinia — uses Vue 3 Composition API with `ref()`, `reactive()`, `computed()`. Data caching via `useNuxtData(CACHE_KEY)` per module.

## Code Style

- **Language**: All UI text is in Arabic. Keep all labels, placeholders, and messages in Arabic.
- **Formatting**: Semicolons enabled, single quotes, no trailing commas, arrow parens always
- **Icons**: Lucide icons via `@iconify-json/lucide` (e.g., `i-lucide-plus`)
- **UI Library**: Nuxt UI v4 (`UButton`, `UFileUpload`, `UAvatar`, etc.)
- **Validation**: Zod 4 schemas with Arabic locale (`app/plugins/zod-arabic.js`). **IMPORTANT**: To override default required/invalid messages for missing values, pass `{ message: '...' }` in the type constructor (e.g. `z.string({ message: 'العنوان مطلوب' })` instead of the deprecated `required_error`). Use `z.string().url()` and `z.string().email()` instead of `z.url()` or `z.email()`.

## Security

### Image & Asset URL Validation

All image URLs from the backend pass through `resolveBackendAssetUrl()` in `server/utils/resolveBackendAssetUrl.js`. This function:

- **Whitelist hosts only**: Allows backend origin + `fileAllowedHosts` from `server/config/proxy.ts` (e.g., `res.cloudinary.com`)
- **Blocks data: and blob: URIs** — no legitimate use for asset URLs
- **Relative paths**: `/images/path/file.jpg` → proxied to backend via `proxyStaticPrefixes`
- **Enforces HTTPS**: Full URLs must use `http://` or `https://`

**Configuration** (`server/config/proxy.ts`):
```js
fileAllowedHosts: ['res.cloudinary.com']  // Only these external hosts allowed for images
staticPrefixes: ['/images']                // Static asset paths (backend origin + path)
```

**Do NOT**:
- Bypass URL validation for frontend-provided image URLs
- Allow arbitrary hostnames — always update `fileAllowedHosts` for new CDNs
- Store user-provided URLs directly — always normalize via `normalizeAvatarSrc()` and validate

## Deployment

Deployed via Coolify on `elshatory-db.beingmomen.com` using `apps/db/Dockerfile`.

**GIGET_AUTH**: The app extends a private GitHub base layer. `GIGET_AUTH` must be set as a **build-time** env var in Coolify so Nuxt can fetch the layer during `nuxt build`. Without it the build fails.

**Do NOT deploy simultaneously with `apps/client`** — concurrent Nuxt builds exhaust VPS RAM. Deploy sequentially.

- Node heap at build: `NODE_OPTIONS=--max-old-space-size=4096`
- Auto-deploy triggers on: `apps/db/**` or `pnpm-lock.yaml` changes

### Syncing Dependencies from Base Layer

The base layer (`../my-base-layer`) provides many dependencies that don't auto-inherit in Nuxt layers.

**When to sync**:
- After pulling changes from base layer that update dependencies
- Before deploying to ensure consistency

**Sync command**:
```bash
pnpm sync-deps    # Reads base layer package.json, merges deps into this project
pnpm install      # Apply updates
```

The script (`scripts/sync-deps.js`):
- Adds missing dependencies from base layer
- Updates versions to match base layer
- Preserves project-specific dependencies
- Shows summary of changes (added, updated, consumer-only)

## Environment

Required env vars (see `.env.example`):
- `NUXT_API_BASE` — Backend API URL (e.g., `http://localhost:1995/api/v1`)
- `NUXT_BACKEND_BASE_URL` — Backend origin without `/api/v1` (e.g., `http://localhost:1995`). Used for image proxy validation.
- `AUTH_ORIGIN` — Auth origin URL (e.g., `http://localhost:9122`)
- `NUXT_DEV_SERVER_PORT` — Dev server port (default: 9122)
- `GIGET_AUTH` — GitHub token (only needed if using GitHub URL for base layer in nuxt.config.ts)
