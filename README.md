# EKsathe Bangladesh — Next.js

Next.js port of the raw PHP agriculture, market and labour platform.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Base UI)
- PostgreSQL 17 via Docker Compose
- Prisma ORM 7 with the `@prisma/adapter-pg` driver adapter
- Better Auth (email + password, Prisma adapter)

## Local setup

```bash
bun install
cp .env.example .env
```

Generate a secret and put it in `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Start the database, apply migrations and seed the 30 service panels:

```bash
bun run db:up
bun run db:migrate
bun run db:seed
```

To load sample accounts, listings and workflow records for the agriculture and
construction services, follow [the local demo data guide](docs/demo-data.md).

Then start the app:

```bash
bun run dev
```

Open <http://localhost:3000>.

In local development, verification and password reset messages are previewed in
the dev server terminal when Resend is not configured or cannot deliver them.
Copy the printed link into a browser. Configure `RESEND_API_KEY` and
`RESEND_FROM` in `.env` to test actual email delivery. Production never uses the
development preview path. The `onboarding@resend.dev` sender in `.env.example`
is for local testing; configure a sender on your verified domain for production.

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run start` | Run the production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test:unit` | Domain unit tests |
| `bun run test:integration` | PostgreSQL-backed marketplace tests (`TEST_DATABASE_URL` required) |
| `bun run test:e2e` | Playwright browser journeys |
| `bun run setup` | Start DB, migrate, seed |
| `bun run db:up` | Start Postgres in Docker |
| `bun run db:down` | Stop Postgres (keeps data) |
| `bun run db:logs` | Follow Postgres logs |
| `bun run db:psql` | Open `psql` in the container |
| `bun run db:migrate` | Create and apply a dev migration |
| `bun run db:deploy` | Apply migrations (production) |
| `bun run db:seed` | Seed the 30 panels (idempotent upserts) |
| `bun run db:seed:demo` | Add opt-in, local-only agriculture and construction demo records |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:status` | Show migration status |
| `bun run db:reset` | **Destructive:** wipe the volume, migrate and seed |

Install the browser once before running Playwright:

```bash
bunx playwright install chromium
bun run test:e2e
```

By default, Playwright starts a dev server on port 3100. Set
`PLAYWRIGHT_BASE_URL` to reuse an already running app.

See [docs/operations.md](docs/operations.md) for readiness, shared rate-limit
configuration, and PostgreSQL backup and restore steps.

## Database

The compose file exposes Postgres on `localhost:5432` with the dev credentials in `.env.example`. If that port is taken, change the mapping in `docker-compose.yml` and update `DATABASE_URL`.

`bun run db:reset` deletes the Docker volume and all data.
