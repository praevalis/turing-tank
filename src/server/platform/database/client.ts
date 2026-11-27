import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import type { DatabaseConnection } from './types';

/**
 * Creates a Kysely client for the supplied PostgreSQL connection.
 *
 * @typeParam Database Application database table types used by Kysely queries.
 * @param databaseUrl Validated PostgreSQL connection URL.
 * @returns A Kysely client backed by a PostgreSQL connection pool. Call `destroy()` when the
 * client is no longer needed so the pool can close cleanly.
 */
export function createDatabaseClient<Database extends object>(
    databaseUrl: string,
): DatabaseConnection<Database> {
    const pool = new Pool({
        connectionString: databaseUrl,
    });

    return new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });
}
