import { describe, expect, it } from 'vitest';

import { parseMigrationConfig } from '@/server/platform/config';

describe('migration configuration', () => {
    it('builds a connection URL for the migration process user', () => {
        const config = parseMigrationConfig({
            DATABASE_HOST: 'localhost',
            DATABASE_NAME: 'turing_tank',
            DATABASE_PASSWORD: 'password',
            DATABASE_PORT: '5432',
            DATABASE_SSL: 'false',
            DATABASE_USER: 'turing_migrate',
        });

        expect(config.DATABASE_URL).toBe(
            'postgresql://turing_migrate:password@localhost:5432/turing_tank',
        );
    });
});
