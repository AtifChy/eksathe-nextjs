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

Then start the app:

```bash
bun run dev
```

Open <http://localhost:3000>.

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run start` | Run the production build |
| `bun run lint` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run setup` | Start DB, migrate, seed |
| `bun run db:up` | Start Postgres in Docker |
| `bun run db:down` | Stop Postgres (keeps data) |
| `bun run db:logs` | Follow Postgres logs |
| `bun run db:psql` | Open `psql` in the container |
| `bun run db:migrate` | Create and apply a dev migration |
| `bun run db:deploy` | Apply migrations (production) |
| `bun run db:seed` | Seed the 30 panels (idempotent upserts) |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:status` | Show migration status |
| `bun run db:reset` | **Destructive:** wipe the volume, migrate and seed |

## Database

The compose file exposes Postgres on `localhost:5432` with the dev credentials in `.env.example`. If that port is taken, change the mapping in `docker-compose.yml` and update `DATABASE_URL`.

`bun run db:reset` deletes the Docker volume and all data.
