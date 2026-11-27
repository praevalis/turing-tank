import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getDatabaseConfig } from '@/server/platform/config';

import { migrateDatabase } from './migration-runner';

async function main(): Promise<void> {
    const { DATABASE_URL } = getDatabaseConfig();
    await migrateDatabase(DATABASE_URL);
}

const entrypoint = process.argv[1];
if (entrypoint !== undefined && resolve(entrypoint) === fileURLToPath(import.meta.url)) {
    void main().catch((error: unknown) => {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Database migration failed.');
        }

        process.exitCode = 1;
    });
}
