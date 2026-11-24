import { z } from 'zod';

const clientConfigSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.url(),
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;

/**
 * Parses browser-safe configuration values.
 *
 * @param env Environment values exposed to the browser.
 * @returns Validated browser-safe configuration.
 * @throws {z.ZodError} If a supplied public configuration value is invalid.
 */
export function parseClientConfig(env: Record<string, string | undefined>): ClientConfig {
    return clientConfigSchema.parse(env);
}

/**
 * Loads and validates browser-safe configuration from public environment variables.
 *
 * @returns Validated browser-safe configuration.
 * @throws {z.ZodError} If a supplied public configuration value is invalid.
 */
export function getClientConfig(): ClientConfig {
    return parseClientConfig({
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
}
