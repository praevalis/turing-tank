import { describe, expect, it } from 'vitest';

import { parseServerConfig } from '@/server/platform/config';

const databaseEnvironment = {
    DATABASE_HOST: 'localhost',
    DATABASE_NAME: 'turing_tank',
    DATABASE_PASSWORD: 'password',
    DATABASE_PORT: '5432',
    DATABASE_SSL: 'false',
    DATABASE_USER: 'turing_app',
};

describe('server configuration', () => {
    it('defaults the authentication session duration to thirty days', () => {
        const config = parseServerConfig(databaseEnvironment);

        expect(config.AUTH_SESSION_DURATION_SECONDS).toBe(2_592_000);
    });

    it('parses a configured authentication session duration', () => {
        const config = parseServerConfig({
            ...databaseEnvironment,
            AUTH_SESSION_DURATION_SECONDS: '3600',
        });

        expect(config.AUTH_SESSION_DURATION_SECONDS).toBe(3600);
    });

    it('rejects a non-positive authentication session duration', () => {
        expect(() =>
            parseServerConfig({
                ...databaseEnvironment,
                AUTH_SESSION_DURATION_SECONDS: '0',
            }),
        ).toThrow();
    });
});
