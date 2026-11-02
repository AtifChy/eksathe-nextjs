# Local demo data

Use the demo seed to explore the implemented agriculture and construction
workflows with customer and provider accounts. It is separate from the regular
sector seed and uses repeatable upserts, so running it again does not reset
requests, quotes, orders, payments, notifications or project progress.

## Load the records

Start the local PostgreSQL database, apply migrations and seed the service
catalogue first:

```bash
bun run db:up
bun run db:migrate
bun run db:seed
```

Then opt in to the demo seed for that command:

```bash
# PowerShell
$env:SEED_DEMO_DATA = "true"; bun run db:seed:demo

# bash
SEED_DEMO_DATA=true bun run db:seed:demo
```

The script refuses to run unless the opt-in is set, `NODE_ENV` is not
`production`, and `DATABASE_URL` points to a local loopback host. It does not
delete records. Listings, provider capabilities and sample accounts are
created only when their stable demo IDs are absent; existing workflow state is
preserved on later runs.

## Demo accounts

All three accounts use the local-only password `Demo-only-123!`.

| Workspace | Email |
| --- | --- |
| Customer | `demo.buyer@example.com` |
| Agriculture provider | `demo.farmer@example.com` |
| Construction provider | `demo.builder@example.com` |

The seed creates produce, worker, machinery, material and construction service
listings. The customer workspace includes an active produce order with a
recorded payment, an agriculture quote awaiting acceptance, and a construction
project with a confirmed consultation, a material quote and sample milestones.

These credentials and records are for local development only. Do not use the
demo password or demo accounts in a deployed environment.
