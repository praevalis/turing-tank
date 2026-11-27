import { parseDatabaseConfig, type DatabaseConfig } from './database';

export type MigrationConfig = DatabaseConfig;

/**
 * Parses configuration for the database migration process.
 *
 * @param env Environment values available to the migration process.
 * @returns Validated migration database configuration.
 * @throws {Error} If a database connection value is missing or invalid.
 */
export function parseMigrationConfig(env: Record<string, string | undefined>): MigrationConfig {
    return parseDatabaseConfig(env);
}

/**
 * Loads configuration for the database migration process.
 *
 * @returns Validated migration database configuration.
 * @throws {Error} If a database connection value is missing or invalid.
 */
export function getMigrationConfig(): MigrationConfig {
    return parseMigrationConfig({
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_PORT: process.env.DATABASE_PORT,
        DATABASE_SSL: process.env.DATABASE_SSL,
        DATABASE_USER: process.env.DATABASE_USER,
    });
}
