import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { Generated } from 'kysely';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createDatabaseClient } from '@/server/platform/database/client';
import { runInTransaction } from '@/server/platform/database/transaction';
import type { DatabaseConnection } from '@/server/platform/database/types';
import { migrateDatabase } from '@scripts/database/migration-runner';

interface TransactionProbeTable {
    id: Generated<number>;
    value: string;
}

interface TransactionProbeDatabase {
    transaction_probe: TransactionProbeTable;
}

describe('database transaction integration', () => {
    let container: StartedPostgreSqlContainer | undefined;
    let database: DatabaseConnection<TransactionProbeDatabase> | undefined;

    beforeAll(async () => {
        container = await new PostgreSqlContainer('postgres:19-alpine')
            .withDatabase('turing_tank_test')
            .withUsername('turing_owner')
            .withPassword('test-owner-password')
            .start();

        const databaseUrl = container.getConnectionUri();
        await createDatabaseRoles(databaseUrl);
        await migrateDatabase(databaseUrl);
        database = createDatabaseClient<TransactionProbeDatabase>(databaseUrl);

        const applicationDatabase = getApplicationDatabase();
        await applicationDatabase.schema
            .createTable('transaction_probe')
            .addColumn('id', 'serial', (column) => column.primaryKey())
            .addColumn('value', 'text', (column) => column.notNull())
            .execute();
    }, 120_000);

    afterAll(async () => {
        if (database === undefined || container === undefined) {
            return;
        }

        const applicationDatabase = getApplicationDatabase();
        await applicationDatabase.schema.dropTable('transaction_probe').execute();
        await database.destroy();
        await container.stop();
    }, 120_000);

    it('commits all work when the transaction succeeds', async () => {
        const applicationDatabase = getApplicationDatabase();
        await runInTransaction(applicationDatabase, async (transaction) => {
            await transaction
                .insertInto('transaction_probe')
                .values({ value: 'committed' })
                .execute();
        });

        const record = await applicationDatabase
            .selectFrom('transaction_probe')
            .select('value')
            .where('value', '=', 'committed')
            .executeTakeFirst();

        expect(record?.value).toBe('committed');
    });

    it('rolls back all work when the transaction fails', async () => {
        const applicationDatabase = getApplicationDatabase();
        await expect(
            runInTransaction(applicationDatabase, async (transaction) => {
                await transaction
                    .insertInto('transaction_probe')
                    .values({ value: 'rolled-back' })
                    .execute();
                throw new Error('force rollback');
            }),
        ).rejects.toThrow('force rollback');

        const records = await applicationDatabase
            .selectFrom('transaction_probe')
            .select('id')
            .where('value', '=', 'rolled-back')
            .execute();

        expect(records).toHaveLength(0);
    });

    /**
     * Returns the test database scoped to the runtime application schema after setup completes.
     *
     * @returns A Kysely connection whose unqualified table names resolve in `turing_app`.
     * @throws {Error} If the database setup did not complete.
     */
    function getApplicationDatabase(): DatabaseConnection<TransactionProbeDatabase> {
        if (database === undefined) {
            throw new Error('The integration database was not initialized.');
        }

        return database.withSchema('turing_app');
    }

    /**
     * Creates the roles referenced by the project migrations in the disposable test database.
     *
     * @param databaseUrl PostgreSQL connection URL for the temporary owner role.
     * @returns A promise that resolves after the migration and runtime roles exist.
     */
    async function createDatabaseRoles(databaseUrl: string): Promise<void> {
        const pool = new Pool({ connectionString: databaseUrl });

        try {
            await pool.query(`
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'turing_migrate') THEN
                        CREATE ROLE turing_migrate NOLOGIN;
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'turing_app') THEN
                        CREATE ROLE turing_app NOLOGIN;
                    END IF;
                END
                $$;
            `);
        } finally {
            await pool.end();
        }
    }
});
