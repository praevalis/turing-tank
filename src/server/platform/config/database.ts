import { z } from 'zod';

const databaseConfigSchema = z
    .object({
        DATABASE_HOST: z.string().min(1),
        DATABASE_NAME: z.string().min(1),
        DATABASE_PASSWORD: z.string().min(1),
        DATABASE_PORT: z.coerce.number().int().min(1).max(65535),
        DATABASE_SSL: z.stringbool().default(false),
        DATABASE_USER: z.string().min(1),
    })
    .transform((values) => {
        const databaseUrl = new URL('postgresql://localhost');

        databaseUrl.hostname = values.DATABASE_HOST;
        databaseUrl.password = values.DATABASE_PASSWORD;
        databaseUrl.pathname = `/${values.DATABASE_NAME}`;
        databaseUrl.port = String(values.DATABASE_PORT);
        databaseUrl.username = values.DATABASE_USER;

        if (values.DATABASE_SSL) {
            databaseUrl.searchParams.set('sslmode', 'require');
        }

        return {
            DATABASE_URL: databaseUrl.toString(),
        };
    });

export type DatabaseConfig = {
    DATABASE_URL: string;
};

/**
 * Parses component database connection values for one active database user.
 *
 * @param env Environment values available to the consuming process.
 * @returns Validated database configuration.
 * @throws {z.ZodError} If a database connection value is missing or invalid.
 */
export function parseDatabaseConfig(env: Record<string, string | undefined>): DatabaseConfig {
    return databaseConfigSchema.parse(env);
}
