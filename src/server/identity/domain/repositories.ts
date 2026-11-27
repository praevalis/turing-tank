import type { AuthSession, PasswordIdentity, User } from './entities';

export interface UserRepository {
    /**
     * Creates a user account without selecting an authentication method.
     *
     * @param email Normalized email address.
     * @param displayName Display name for the user.
     * @returns The created user.
     */
    create(email: string, displayName: string): Promise<User>;

    /**
     * Finds a password identity by normalized email.
     *
     * @param email Normalized email address.
     * @returns The identity when it exists, otherwise undefined.
     */
    findWithPasswordByEmail(email: string): Promise<PasswordIdentity | undefined>;

    /**
     * Finds a user by its identifier.
     *
     * @param userId User identifier.
     * @returns The user when it exists, otherwise undefined.
     */
    findById(userId: string): Promise<User | undefined>;
}

export interface CredentialRepository {
    /**
     * Creates a password credential for an existing user.
     *
     * @param userId User identifier.
     * @param passwordHash Password hash for persistent storage.
     * @returns The created credential.
     */
    createPassword(userId: string, passwordHash: string): Promise<PasswordIdentity['credential']>;

    /**
     * Records successful use of a password credential.
     *
     * @param credentialId Password credential identifier.
     * @param usedAt Timestamp of successful authentication.
     */
    markPasswordUsed(credentialId: string, usedAt: Date): Promise<void>;
}

export interface AuthSessionRepository {
    /**
     * Creates a server-side session for a user.
     *
     * @param userId User owning the session.
     * @param tokenDigest Digest of the opaque session token.
     * @param expiresAt Session expiration timestamp.
     * @returns The persisted session.
     */
    create(userId: string, tokenDigest: string, expiresAt: Date): Promise<AuthSession>;

    /**
     * Finds a session that is neither revoked nor expired.
     *
     * @param tokenDigest Digest of the opaque session token.
     * @param now Current timestamp used for expiry evaluation.
     * @returns The active session when found, otherwise undefined.
     */
    findActiveByTokenDigest(tokenDigest: string, now: Date): Promise<AuthSession | undefined>;

    /**
     * Revokes a session if it is still active.
     *
     * @param sessionId Session identifier.
     * @param revokedAt Timestamp of revocation.
     */
    revoke(sessionId: string, revokedAt: Date): Promise<void>;

    /**
     * Updates the last-used timestamp for a session.
     *
     * @param sessionId Session identifier.
     * @param usedAt Timestamp of use.
     */
    touch(sessionId: string, usedAt: Date): Promise<void>;
}

export interface IdentityRepositorySet {
    credentials: CredentialRepository;
    sessions: AuthSessionRepository;
    users: UserRepository;
}

export interface IdentityUnitOfWork {
    /**
     * Runs repository work inside one short transaction.
     *
     * @param operation Repository operations to execute atomically.
     * @returns The value returned by the operation after commit.
     */
    run<Result>(
        operation: (repositories: IdentityRepositorySet) => Promise<Result>,
    ): Promise<Result>;
}
