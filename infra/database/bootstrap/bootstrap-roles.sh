#!/bin/sh
set -eu

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=database_password="$DATABASE_PASSWORD" <<'SQL'
SELECT format('CREATE ROLE turing_migrate LOGIN PASSWORD %L', :'database_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'turing_migrate') \gexec

SELECT format('CREATE ROLE turing_app LOGIN PASSWORD %L', :'database_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'turing_app') \gexec

SELECT format('REVOKE CONNECT ON DATABASE %I FROM PUBLIC', current_database()) \gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO turing_migrate, turing_app', current_database()) \gexec

CREATE SCHEMA IF NOT EXISTS turing_meta AUTHORIZATION turing_migrate;
REVOKE ALL ON SCHEMA turing_meta FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SQL
