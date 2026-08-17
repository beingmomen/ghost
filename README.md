# Beingmomen Monorepo

The codebase behind [beingmomen.com](https://beingmomen.com) — my portfolio,
its REST API, and the admin dashboard I use to manage its content.

Built as a pnpm workspace so the three apps share tooling and a single
lockfile, while each deploys independently: a push that only touches
`apps/client` won't rebuild the API. Self-hosted on a VPS running
CloudPanel, with a GitHub Actions self-hosted runner and PM2 handling
builds and process management rather than a managed platform, which
keeps deployment under my control.

Arabic-first with full RTL support throughout.

![Beingmomen](apps/client/public/image.png)

## Apps

| App        | Path          | Description                                                                                    |
| ---------- | ------------- | ---------------------------------------------------------------------------------------------- |
| **client** | `apps/client` | Portfolio — Nuxt 4, live at [beingmomen.com](https://beingmomen.com)                           |
| **server** | `apps/server` | REST API — Express                                                                             |
| **db**     | `apps/db`     | Admin dashboard — Nuxt 4. Content management for the portfolio: projects, blog posts, and ADRs |

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

Each app deploys independently on push to `main`, via a self-hosted GitHub
Actions runner that builds only the changed apps, sequentially:

- `apps/client/**` → rebuilds client
- `apps/server/**` → restarts server
- `apps/db/**` → rebuilds db
- `pnpm-lock.yaml` → reinstalls and rebuilds all three

## Stack

- **Runtime**: Node.js 24 (see `.nvmrc`) + pnpm 10
- **Frontend**: Nuxt 4, Nuxt UI v4, Tailwind CSS v4
- **Backend**: Express.js
- **Proxy**: CloudPanel (nginx) + Let's Encrypt (SSL)
- **Platform**: CloudPanel VPS + PM2 (self-hosted)
