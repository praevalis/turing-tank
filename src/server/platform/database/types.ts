import type { Kysely, Transaction } from 'kysely';

/**
 * Represents the application database connection for one concrete database type map.
 *
 * @typeParam Database Kysely table definitions for the consuming application module.
 */
export type DatabaseConnection<Database extends object> = Kysely<Database>;

/**
 * Represents the transaction passed to a repository operation.
 *
 * @typeParam Database Kysely table definitions for the consuming application module.
 */
export type DatabaseTransaction<Database extends object> = Transaction<Database>;
