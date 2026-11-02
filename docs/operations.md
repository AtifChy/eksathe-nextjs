# Operations

## Readiness

`GET /api/health/ready` returns `200` while the application can reach PostgreSQL
and `503` if the database is unavailable. It does not expose connection details.

## Rate limiting

Better Auth limits sign-in, sign-up, password reset, and verification email
requests. Upload URL preparation is limited to 20 requests per account in ten
minutes. Without shared Redis, limits use in-process memory and are suitable
for development or a single application instance.

For a multi-instance deployment, set `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` to enable shared rate-limit storage. If configured
Redis becomes unavailable, authentication fails closed and upload preparation
returns `503`.

## PostgreSQL backups

Create the `backups` directory on the host, then write a compressed dump into
the database container and copy it out:

```powershell
New-Item -ItemType Directory -Force -Path backups
docker compose exec -T db pg_dump -U eksathe -d eksathe -Fc -f /tmp/eksathe.dump
docker compose cp db:/tmp/eksathe.dump ".\backups\eksathe-$(Get-Date -Format yyyyMMdd).dump"
```

Restore a dump into the local database with:

```powershell
docker compose cp ".\backups\eksathe-YYYYMMDD.dump" db:/tmp/restore.dump
docker compose exec -T db pg_restore -U eksathe -d eksathe --clean --if-exists /tmp/restore.dump
```

Schedule equivalent backups with the production database provider and test
restores before relying on them. Backup files are ignored by Git.
