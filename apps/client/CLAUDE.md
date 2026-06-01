# CLAUDE.md — Portfolio (new-client)

## Commands

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
```

## Architecture

- **Framework**: Nuxt 4.3.1 + Nuxt UI 4
- **CSS**: Tailwind CSS v4 + Nuxt UI theme system
- **Data**: Backend API (not Nuxt Content)
- **Language**: Arabic RTL (dir="rtl", lang="ar")
- **Font**: Tajawal (Arabic, self-hosted) + Rubik (display/headings, `font-display`)
- **Theme**: Primary = amber, Neutral = stone (warm amber visual identity)

## Data Flow

```
Pages → Composables → useApiRequest → $api plugin → Backend API
```

Inspect live content: `curl "$(grep ^BASE_URL apps/client/.env | cut -d= -f2-)/landing" | jq '.data'`
(`BASE_URL` points to the local server — `pnpm dev:server` must be running).

- `app/plugins/api.ts` — Creates `$api` helper with base URL from runtimeConfig
- `app/composables/useApiRequest.js` — Generic HTTP request wrapper with error handling
- `app/composables/useAPI.ts` — `useFetch` wrapper with `$api` client
- Landing/blog data: fetched directly via `useAPI('/landing')` and `/api/blog`, shared across sections with `useNuxtData('landing')` (no dedicated composable)
- `app/composables/useExperiences.js` — Work experiences data (static)
- `app/composables/useBreadcrumbSchema.ts` — Breadcrumb structured data
- `app/composables/useErrorHandler.js` — Toast-based error handling

## Component Organization

```
app/components/
├── landing/           # Landing page sections
│   ├── Hero.vue       # Hero section
│   ├── About.vue      # About section (inline data)
│   ├── WorkExperience.vue # Work timeline (useExperiences)
│   ├── Testimonials.vue   # Testimonials marquee
│   ├── Blog.vue       # Latest 3 blogs (API)
│   └── FAQ.vue        # Accordion tabs (inline data)
├── blog/              # Blog page components
│   ├── BlogSidebar.vue
│   ├── BlogSidebarLinks.vue
│   └── BlogSidebarTableOfContents.vue
├── common/            # Social links
│   ├── CommonSocialPart.vue
│   └── CommonSocialPartLink.vue
├── form/              # File upload component
│   └── FileInput.vue
├── adr/               # ADR (Architecture Decision Records) components (8)
├── sdlc/              # SDLC English components (7)
├── sdlc-ar/           # SDLC Arabic components (7)
├── AppHeader.vue      # Navigation header
├── AppFooter.vue      # Footer
├── ColorModeButton.vue # Dark/light toggle
└── PolaroidItem.vue   # Polaroid image card
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with 10 sections |
| `/blog` | Blog list with cards grid |
| `/blog/[slug]` | Single blog with sidebar + TOC |
| `/about` | About page with polaroid gallery |
| `/projects` | Projects grid |
| `/testimonial` | Testimonial form (Cloudinary upload) |
| `/learning-roadmap` | Senior learning roadmap (live progress from API) |
| `/contact` | Contact form (Zod validation) |
| `/sdlc` | SDLC English page |
| `/sdlc-ar` | SDLC Arabic page |
| `/adr` | Architecture Decision Records |
| `/agents` | Agents — browse (add/delete dev-only via `dev-only` middleware) |
| `/commands` | Commands — browse (add/delete dev-only) |
| `/mcp` | MCP servers — browse + download `.mcp.json` (add/delete dev-only) |
| `/skills` | Skills — browse (add/delete dev-only) |

## Modules

- `@nuxt/ui` — UI component library (Nuxt UI 4)
- `@nuxt/image` — Image optimization (Cloudinary provider)
- `@nuxt/fonts` — Google Fonts (Tajawal + Space Grotesk)
- `@nuxt/eslint` — ESLint integration
- `motion-v/nuxt` — Animation library (replaced GSAP)
- `@nuxtjs/seo` — SEO suite (sitemap, robots, schema.org, og-image)
- `@stefanobartoletti/nuxt-social-share` — Social sharing
- `@nuxtjs/fontaine` — Font fallback optimization

## Utils

- `app/utils/clipboard.ts` — Clipboard copy utility
- `app/utils/links.ts` — Navigation and social links data

## Styling

- **Tailwind v4** with `@theme static` for custom colors in `app/assets/css/main.css`
- `.text-gradient` utility class for gradient text
- SDLC glassmorphism and aurora animation styles (scoped in SDLC components)
- Typography styles in `app/assets/css/typography.css` (Tiptap/ProseMirror)

## RTL

- Arabic-first: `dir="rtl"`, `lang="ar"` on `<html>`
- UApp uses `import { ar } from '@nuxt/ui/locale'`
- Use `text-right` for text alignment
- Use `i-lucide-arrow-left` for "forward" arrows (RTL)

## Plan Mode

- Write all plan mode outputs in Arabic
- Keep technical terms in English (component, composable, API, SSR, route, etc.)
- Use the arabic-planner agent proactively for plan research
- Wrap plan file content with `<div dir="rtl">` at the start and `</div>` at the end for Arabic RTL display

## Nuxt UI 4 Patterns

- Use semantic colors: `error`, `success`, `warning`, `info` (not `red`, `green`, etc.)
- Icon format: `i-lucide-name` (not `lucide:name`)
- UApp locale: `<UApp :locale="ar">`
- Toast via `useToast()` with semantic colors

## Key Config Files

- `app/app.config.ts` — UI colors (`primary: 'amber'`, `neutral: 'stone'`), global config, footer links
- `app/layouts/default.vue` — Default layout with AppHeader + AppFooter
- `nuxt.config.ts` — Modules, runtimeConfig, routeRules, SEO settings

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Backend API base URL |
| `SITE_URL` | Public site URL |
| `PORT` | Server port |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_UPLOAD_PRESET` | Upload preset |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_URL` | Base URL |
| `LOGO` | Site logo URL |

## Server Routes

- `server/api/blog.get.js` — Proxy blog API + generates RSS feed
- `server/api/agents.{post,delete}.ts` — Agents CRUD
- `server/api/commands.{post,delete}.ts` — Commands CRUD
- `server/api/mcp.{post,delete}.ts` — MCP servers CRUD
- `server/api/skills.{post,delete}.ts` — Skills CRUD
- `server/api/upload.post.ts` — File upload endpoint
- `server/api/__sitemap__/urls.get.ts` — Dynamic sitemap URLs
- `server/og-image/OgImageArabic.vue` — Arabic OG image template
- `server/plugins/epipe-handler.ts` — EPIPE error handler

## Deployment

Deployed via Coolify on `elshatory-web.beingmomen.com` using `apps/client/Dockerfile`.

**Critical — build-time env vars**: `nuxt.config.ts` bakes `BASE_URL` into the CSP `connect-src` header at build time. If `BASE_URL` is set as runtime-only in Coolify, browser API calls will be blocked. Always set these as **build-time + runtime** in Coolify:
- `BASE_URL`, `SITE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_URL`

**Do NOT deploy simultaneously with `apps/db`** — concurrent Nuxt builds exhaust VPS RAM. Deploy sequentially.

- Route rules: Static pages prerendered, blog uses SWR caching
- Node heap at build: `NODE_OPTIONS=--max-old-space-size=4096`
- Node heap at runtime: `NODE_OPTIONS=--max-old-space-size=2048`

## Documentation

In-repo docs under `docs/` (Arabic, RTL):

- `docs/WEBSITE_REVIEW_2026-06.md` — Visitor-experience review + implemented improvements (technical-content dropdown, dev-only admin UIs, naming unification, dead-code removal, unified `pnpm dev`).
- `docs/IMPROVEMENTS.md` — Earlier batch of 17 improvements + architecture/conventions guide.
- `docs/STATIC_DATA_REPORT.md` — Inventory of all static (non-API) data in the app.

**Dev-only admin UIs:** `agents/new`, `commands/new`, `mcp/new`, `skills/new` are gated by `app/middleware/dev-only.ts` (404 in production). The add/select/delete controls in the matching index pages are hidden via `import.meta.dev`. MCP keeps its select + "download .mcp.json" feature public; only delete is dev-only.
