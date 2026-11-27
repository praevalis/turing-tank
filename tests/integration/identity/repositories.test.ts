import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { UserEmailAlreadyRegisteredError } from '@/server/identity/domain/errors';
import type { IdentityDatabase } from '@/server/identity/persistence/database';
import { KyselyIdentityUnitOfWork } from '@/server/identity/persistence/unit-of-work';
import { createDatabaseClient } from '@/server/platform/database';
import type { DatabaseConnection } from '@/server/platform/database';
import { startTestDatabase, stopTestDatabase, type TestDatabase } from '@tests/fixtures/postgres';

describe('identity repositories integration', () => {
    let testDatabase: TestDatabase | undefined;
    let database: DatabaseConnection<IdentityDatabase> | undefined;
    let unitOfWork: KyselyIdentityUnitOfWork | undefined;

    beforeAll(async () => {
        const startedDatabase = await startTestDatabase();
        testDatabase = startedDatabase;
        database = createDatabaseClient<IdentityDatabase>(startedDatabase.applicationUrl);
        unitOfWork = new KyselyIdentityUnitOfWork(database);
    }, 120_000);

    afterAll(async () => {
        if (database !== undefined) {
            await database.destroy();
        }
        if (testDatabase !== undefined) {
            await stopTestDatabase(testDatabase);
        }
    }, 120_000);

    it('persists password identities without exposing the raw password', async () => {
        const context = getContext();
        const identity = await context.unitOfWork.run(async ({ credentials, users }) => {
            const user = await users.create('ada@example.com', 'Ada Lovelace');
            const credential = await credentials.createPassword(user.id, 'argon2id-hash');

            return { credential, user };
        });

        expect(identity.user.email).toBe('ada@example.com');
        expect(identity.credential.passwordHash).toBe('argon2id-hash');
        expect(identity.credential.providerKey).toBeNull();

        const stored = await context.database
            .withSchema('turing_app')
            .selectFrom('credentials')
            .select('password_hash')
            .where('user_id', '=', identity.user.id)
            .executeTakeFirstOrThrow();

        expect(stored.password_hash).not.toBe('plain-text-password');
    });

    it('translates the database email uniqueness constraint', async () => {
        await expect(
            getContext().unitOfWork.run(async ({ credentials, users }) => {
                const user = await users.create('ADA@example.com', 'Another Ada');
                const credential = await credentials.createPassword(user.id, 'another-hash');

                return { credential, user };
            }),
        ).rejects.toBeInstanceOf(UserEmailAlreadyRegisteredError);
    });

    it('does not return expired or revoked sessions', async () => {
        const context = getContext();
        const identity = await context.unitOfWork.run(async ({ credentials, users }) => {
            const user = await users.create('grace@example.com', 'Grace Hopper');
            const credential = await credentials.createPassword(user.id, 'argon2id-hash');

            return { credential, user };
        });
        const expiresAt = new Date('2026-12-27T10:00:00.000Z');
        const session = await context.unitOfWork.run(({ sessions }) =>
            sessions.create(identity.user.id, 'digest-grace', expiresAt),
        );

        await expect(
            context.unitOfWork.run(({ sessions }) =>
                sessions.findActiveByTokenDigest(
                    'digest-grace',
                    new Date('2026-12-01T00:00:00.000Z'),
                ),
            ),
        ).resolves.toMatchObject({ id: session.id });
        await context.unitOfWork.run(({ sessions }) =>
            sessions.revoke(session.id, new Date('2026-11-27T11:00:00.000Z')),
        );
        await expect(
            context.unitOfWork.run(({ sessions }) =>
                sessions.findActiveByTokenDigest(
                    'digest-grace',
                    new Date('2026-12-01T00:00:00.000Z'),
                ),
            ),
        ).resolves.toBeUndefined();
    });

    function getContext(): {
        database: DatabaseConnection<IdentityDatabase>;
        unitOfWork: KyselyIdentityUnitOfWork;
    } {
        if (database === undefined || unitOfWork === undefined) {
            throw new Error('The identity integration database was not initialized.');
        }

        return { database, unitOfWork };
    }
});
