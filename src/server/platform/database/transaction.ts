import type { DatabaseConnection, DatabaseTransaction } from './types';

/**
 * Runs one application mutation inside a short database transaction.
 *
 * The callback must contain only database work. Model calls, network requests, and other
 * external operations must complete before or after this transaction so a database connection
 * is not held while waiting on an external system.
 *
 * @param database Kysely database connection that owns the transaction.
 * @param operation Database work to execute atomically.
 * @returns The value returned by the transaction callback after commit.
 * @throws {Error} The original application or database error when the transaction cannot commit.
 */
export async function runInTransaction<Database extends object, Result>(
    database: DatabaseConnection<Database>,
    operation: (transaction: DatabaseTransaction<Database>) => Promise<Result>,
): Promise<Result> {
    return database.transaction().execute(operation);
}
