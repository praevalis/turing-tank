import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';

import { migrateDatabase } from '@scripts/database/migration-runner';

export interface TestDatabase {
    applicationUrl: string;
    container: StartedPostgreSqlContainer;
    ownerUrl: string;
}

/**
 * Starts a disposable PostgreSQL database with the project's roles and migrations.
 *
 * @returns Owner and application connection URLs plus the running container.
 */
export async function startTestDatabase(): Promise<TestDatabase> {
    const container = await new PostgreSqlContainer('postgres:19-alpine')
        .withDatabase('turing_tank_test')
        .withUsername('turing_owner')
        .withPassword('test-owner-password')
        .start();
    const ownerUrl = container.getConnectionUri();

    try {
        await createDatabaseRoles(ownerUrl);
        await migrateDatabase(ownerUrl);

        return {
            applicationUrl: createRoleUrl(ownerUrl, 'turing_app', 'test-app-password'),
            container,
            ownerUrl,
        };
    } catch (error: unknown) {
        await container.stop();
        throw error;
    }
}

/**
 * Stops a disposable PostgreSQL database.
 *
 * @param database Database returned by startTestDatabase.
 */
export async function stopTestDatabase(database: TestDatabase): Promise<void> {
    await database.container.stop();
}

async function createDatabaseRoles(databaseUrl: string): Promise<void> {
    const pool = new Pool({ connectionString: databaseUrl });

    try {
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'turing_migrate') THEN
                    CREATE ROLE turing_migrate LOGIN PASSWORD 'test-migrate-password';
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'turing_app') THEN
                    CREATE ROLE turing_app LOGIN PASSWORD 'test-app-password';
                END IF;
            END
            $$;
        `);
    } finally {
        await pool.end();
    }
}

function createRoleUrl(databaseUrl: string, username: string, password: string): string {
    const url = new URL(databaseUrl);
    url.username = username;
    url.password = password;
    return url.toString();
}
