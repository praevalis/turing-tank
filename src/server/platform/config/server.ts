import { z } from 'zod';

import { parseDatabaseConfig, type DatabaseConfig } from './database';

const serverConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type ServerConfig = z.infer<typeof serverConfigSchema> & DatabaseConfig;

/**
 * Parses private server configuration values.
 *
 * @param env Environment values available to the server.
 * @returns Validated server configuration.
 * @throws {z.ZodError} If a supplied server configuration value is invalid.
 */
export function parseServerConfig(env: Record<string, string | undefined>): ServerConfig {
    return {
        ...serverConfigSchema.parse(env),
        ...parseDatabaseConfig(env),
    };
}

/**
 * Loads and validates private server configuration from the process environment.
 *
 * @returns Validated server configuration.
 * @throws {z.ZodError} If a supplied server configuration value is invalid.
 */
export function getServerConfig(): ServerConfig {
    return parseServerConfig({
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_PORT: process.env.DATABASE_PORT,
        DATABASE_SSL: process.env.DATABASE_SSL,
        DATABASE_USER: process.env.DATABASE_USER,
        NODE_ENV: process.env.NODE_ENV,
        LOG_LEVEL: process.env.LOG_LEVEL,
    });
}
