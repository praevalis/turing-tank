import type { Generated } from 'kysely';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createDatabaseClient } from '@/server/platform/database/client';
import { runInTransaction } from '@/server/platform/database/transaction';
import type { DatabaseConnection } from '@/server/platform/database/types';
import { startTestDatabase, stopTestDatabase, type TestDatabase } from '@tests/fixtures/postgres';

interface TransactionProbeTable {
    id: Generated<number>;
    value: string;
}

interface TransactionProbeDatabase {
    transaction_probe: TransactionProbeTable;
}

describe('database transaction integration', () => {
    let testDatabase: TestDatabase | undefined;
    let database: DatabaseConnection<TransactionProbeDatabase> | undefined;

    beforeAll(async () => {
        const startedDatabase = await startTestDatabase();
        testDatabase = startedDatabase;
        database = createDatabaseClient<TransactionProbeDatabase>(startedDatabase.ownerUrl);

        const applicationDatabase = getApplicationDatabase();
        await applicationDatabase.schema
            .createTable('transaction_probe')
            .addColumn('id', 'serial', (column) => column.primaryKey())
            .addColumn('value', 'text', (column) => column.notNull())
            .execute();
    }, 120_000);

    afterAll(async () => {
        if (database === undefined || testDatabase === undefined) {
            return;
        }

        const applicationDatabase = getApplicationDatabase();
        await applicationDatabase.schema.dropTable('transaction_probe').execute();
        await database.destroy();
        await stopTestDatabase(testDatabase);
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
});
