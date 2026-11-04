# EKsathe Bangladesh

Next.js app for the EKsathe Bangladesh service platform. Agriculture and
construction are available for browsing and demo workflows.

## Get started

You need [Bun](https://bun.sh/) and Docker Desktop installed.

1. Install dependencies and copy the environment template:

   ```powershell
   bun install
   Copy-Item .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env` instead.

2. Open `.env` and replace `BETTER_AUTH_SECRET` with a new secret. Generate one
   with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. Start PostgreSQL, apply migrations, and load the service catalogue:

   ```bash
   bun run db:up
   bun run db:migrate
   bun run db:seed
   ```

4. Start the app and open <http://localhost:3000>:

   ```bash
   bun run dev
   ```

In development, account verification and password reset links are printed in
the dev server terminal when email delivery is not configured.

## Demo accounts

To load sample agriculture and construction listings, orders, and a project,
follow [the demo data guide](docs/demo-data.md). The guide includes local demo
logins.

## Useful commands

| Command             | Purpose                       |
| ------------------- | ----------------------------- |
| `bun run lint`      | Check code style              |
| `bun run typecheck` | Check TypeScript              |
| `bun run build`     | Create a production build     |
| `bun run db:studio` | Browse local database records |

For R2 or other S3 compatible file uploads, see [object storage setup](docs/object-storage.md).
For database backups and deployment checks, see [operations](docs/operations.md).
