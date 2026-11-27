import { getServerConfig } from '@/server/platform/config';
import { createDatabaseClient } from '@/server/platform/database';

import { IdentityService } from './application/identity-service';
import type { IdentityDatabase } from './persistence/database';
import { KyselyIdentityUnitOfWork } from './persistence/unit-of-work';
import { Argon2PasswordHasher } from './security/argon2-password-hasher';
import { CryptographicSessionTokenGenerator } from './security/session-token';

export interface IdentityApplication {
    service: IdentityService;

    /**
     * Closes the database resources owned by the application composition.
     *
     * @returns A promise that resolves after the database pool closes.
     */
    close(): Promise<void>;
}

/**
 * Composes the identity application against the active server database.
 *
 * @param databaseUrl Optional database URL, primarily useful for integration composition.
 * @param sessionDurationSeconds Optional session lifetime override, primarily useful for tests.
 * @returns Identity service and a disposer for its database pool.
 */
export function createIdentityApplication(
    databaseUrl?: string,
    sessionDurationSeconds?: number,
): IdentityApplication {
    const config = getServerConfig();
    const database = createDatabaseClient<IdentityDatabase>(databaseUrl ?? config.DATABASE_URL);
    const unitOfWork = new KyselyIdentityUnitOfWork(database);

    return {
        close: () => database.destroy(),
        service: new IdentityService(
            unitOfWork,
            new Argon2PasswordHasher(),
            new CryptographicSessionTokenGenerator(),
            sessionDurationSeconds ?? config.AUTH_SESSION_DURATION_SECONDS,
        ),
    };
}
