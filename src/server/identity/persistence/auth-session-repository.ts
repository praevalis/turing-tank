import { randomUUID } from 'node:crypto';

import type { Selectable } from 'kysely';

import type { AuthSession } from '@/server/identity/domain/entities';
import type { AuthSessionRepository } from '@/server/identity/domain/repositories';

import type { IdentityDatabaseExecutor } from './database';
import type { AuthSessionsTable } from './tables';

type AuthSessionRow = Selectable<AuthSessionsTable>;

/** Persists opaque authentication sessions through Kysely. */
export class KyselyAuthSessionRepository implements AuthSessionRepository {
    private readonly database: IdentityDatabaseExecutor;

    public constructor(database: IdentityDatabaseExecutor) {
        this.database = database;
    }

    /**
     * Creates a server-side session for a user.
     *
     * @param userId User owning the session.
     * @param tokenDigest Digest of the opaque session token.
     * @param expiresAt Session expiration timestamp.
     * @returns The persisted session.
     */
    public async create(
        userId: string,
        tokenDigest: string,
        expiresAt: Date,
    ): Promise<AuthSession> {
        const now = new Date();
        const row = await this.database
            .withSchema('turing_app')
            .insertInto('auth_sessions')
            .values({
                created_at: now,
                expires_at: expiresAt,
                id: randomUUID(),
                last_used_at: null,
                revoked_at: null,
                token_digest: tokenDigest,
                updated_at: now,
                user_id: userId,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return mapAuthSession(row);
    }

    /**
     * Finds a session that is neither revoked nor expired.
     *
     * @param tokenDigest Digest of the opaque session token.
     * @param now Current timestamp used for expiry evaluation.
     * @returns The active session when found, otherwise undefined.
     */
    public async findActiveByTokenDigest(
        tokenDigest: string,
        now: Date,
    ): Promise<AuthSession | undefined> {
        const row = await this.database
            .withSchema('turing_app')
            .selectFrom('auth_sessions')
            .selectAll()
            .where('token_digest', '=', tokenDigest)
            .where('expires_at', '>', now)
            .where('revoked_at', 'is', null)
            .executeTakeFirst();

        return row === undefined ? undefined : mapAuthSession(row);
    }

    /**
     * Revokes a session if it is still active.
     *
     * @param sessionId Session identifier.
     * @param revokedAt Timestamp of revocation.
     */
    public async revoke(sessionId: string, revokedAt: Date): Promise<void> {
        await this.database
            .withSchema('turing_app')
            .updateTable('auth_sessions')
            .set({
                revoked_at: revokedAt,
                updated_at: revokedAt,
            })
            .where('id', '=', sessionId)
            .where('revoked_at', 'is', null)
            .execute();
    }

    /**
     * Updates the last-used timestamp for a session.
     *
     * @param sessionId Session identifier.
     * @param usedAt Timestamp of use.
     */
    public async touch(sessionId: string, usedAt: Date): Promise<void> {
        await this.database
            .withSchema('turing_app')
            .updateTable('auth_sessions')
            .set({
                last_used_at: usedAt,
                updated_at: usedAt,
            })
            .where('id', '=', sessionId)
            .execute();
    }
}

function mapAuthSession(row: AuthSessionRow): AuthSession {
    return {
        createdAt: row.created_at,
        expiresAt: row.expires_at,
        id: row.id,
        lastUsedAt: row.last_used_at,
        revokedAt: row.revoked_at,
        tokenDigest: row.token_digest,
        updatedAt: row.updated_at,
        userId: row.user_id,
    };
}
