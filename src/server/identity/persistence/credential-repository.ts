import { randomUUID } from 'node:crypto';

import type { Selectable } from 'kysely';

import type { Credential } from '@/server/identity/domain/entities';
import type { CredentialRepository } from '@/server/identity/domain/repositories';

import type { IdentityDatabaseExecutor } from './database';
import type { CredentialsTable } from './tables';

type CredentialRow = Selectable<CredentialsTable>;

/** Persists credentials through the identity database connection or transaction. */
export class KyselyCredentialRepository implements CredentialRepository {
    private readonly database: IdentityDatabaseExecutor;

    public constructor(database: IdentityDatabaseExecutor) {
        this.database = database;
    }

    /**
     * Creates a password credential for an existing user.
     *
     * @param userId User identifier.
     * @param passwordHash Password hash for persistent storage.
     * @returns The created credential.
     */
    public async createPassword(userId: string, passwordHash: string): Promise<Credential> {
        const row = await this.database
            .withSchema('turing_app')
            .insertInto('credentials')
            .values({
                credential_type: 'password',
                id: randomUUID(),
                last_used_at: null,
                password_hash: passwordHash,
                provider_key: null,
                provider_subject: null,
                status: 'active',
                user_id: userId,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return mapCredential(row);
    }

    /**
     * Records successful use of a password credential.
     *
     * @param credentialId Password credential identifier.
     * @param usedAt Timestamp of successful authentication.
     */
    public async markPasswordUsed(credentialId: string, usedAt: Date): Promise<void> {
        await this.database
            .withSchema('turing_app')
            .updateTable('credentials')
            .set({
                last_used_at: usedAt,
                updated_at: usedAt,
            })
            .where('id', '=', credentialId)
            .where('credential_type', '=', 'password')
            .execute();
    }
}

function mapCredential(row: CredentialRow): Credential {
    return {
        createdAt: row.created_at,
        id: row.id,
        lastUsedAt: row.last_used_at,
        passwordHash: row.password_hash,
        providerKey: row.provider_key,
        providerSubject: row.provider_subject,
        status: row.status,
        type: row.credential_type,
        updatedAt: row.updated_at,
        userId: row.user_id,
    };
}
