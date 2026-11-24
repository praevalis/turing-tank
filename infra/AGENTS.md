# Infrastructure implementation guidelines

These rules apply to `infra/` in addition to the repository guidelines. This directory defines local and deployable infrastructure; runtime application behavior belongs under `src/`.

## Database ownership and roles

- Bootstrap the database with `turing_owner`, run migrations with `turing_migrate`, and run application queries with `turing_app`.
- Keep the active connection configuration generic. The process selects the appropriate database user through `DATABASE_USER` and `DATABASE_PASSWORD`.
- Do not grant the application user schema-definition or migration privileges.
- Do not commit production credentials or secrets.

## Migrations

- Store migrations as pure SQL files under `infra/database/migrations/`.
- Name project-owned PostgreSQL schemas with lowercase snake_case and a `turing_` prefix. Keep runtime objects in `turing_app` and migration bookkeeping in `turing_meta`.
- Do not place project-owned schemas or tables in `public`.
- Begin each filename with a unique four-digit serial identifier, such as `0001` or `0002`.
- Begin every migration with a concise SQL comment explaining the change.
- Do not renumber or reuse an identifier after the migration is applied.
- Keep each migration focused on one coherent database change.
- Keep application domain behavior out of migrations.

## Local services

- Keep the local PostgreSQL topology in the root `docker-compose.yml`.
- Use health checks and named volumes for stateful local services.
- Keep infrastructure setup separate from the runtime Kysely client under `src/server/platform/`.
