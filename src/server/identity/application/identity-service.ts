import type { User } from '@/server/identity/domain/entities';
import {
    CredentialAuthenticationError,
    SessionInvalidError,
} from '@/server/identity/domain/errors';
import type { PasswordHasher } from '@/server/identity/domain/password-hasher';
import type { IdentityUnitOfWork } from '@/server/identity/domain/repositories';
import type { SessionTokenGenerator } from '@/server/identity/domain/session-token';

export interface AuthenticatedSession {
    expiresAt: Date;
    token: string;
    user: User;
}

/**
 * Coordinates account registration, password authentication, and opaque sessions.
 *
 * @remarks The service never persists a raw session token and never exposes password hashes to
 * its callers. Provider credentials are represented by the domain model but are not handled here.
 */
export class IdentityService {
    private readonly clock: () => Date;

    public constructor(
        private readonly unitOfWork: IdentityUnitOfWork,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenGenerator: SessionTokenGenerator,
        private readonly sessionDurationSeconds: number,
        clock: () => Date = () => new Date(),
    ) {
        this.clock = clock;
    }

    /**
     * Registers a user with one password credential.
     *
     * @param email Email address supplied by the request boundary.
     * @param password Plaintext password supplied by the request boundary.
     * @param displayName Display name supplied by the request boundary.
     * @returns The newly created user.
     */
    public async signUp(email: string, password: string, displayName: string): Promise<User> {
        const passwordHash = await this.passwordHasher.hash(password);
        const normalizedEmail = this.normalizeEmail(email);
        const normalizedDisplayName = displayName.trim();

        const identity = await this.unitOfWork.run(async ({ credentials, users }) => {
            const user = await users.create(normalizedEmail, normalizedDisplayName);
            const credential = await credentials.createPassword(user.id, passwordHash);

            return { credential, user };
        });

        return identity.user;
    }

    /**
     * Authenticates a password identity and creates an opaque server-side session.
     *
     * @param email Email address supplied by the request boundary.
     * @param password Password supplied by the request boundary.
     * @returns The user and raw token that must be set only in an HTTP-only cookie.
     * @throws {CredentialAuthenticationError} When the account or password is invalid.
     */
    public async signIn(email: string, password: string): Promise<AuthenticatedSession> {
        const identity = await this.unitOfWork.run(({ users }) =>
            users.findWithPasswordByEmail(this.normalizeEmail(email)),
        );
        const passwordMatches = await this.passwordHasher.verify(
            password,
            identity?.credential.passwordHash ?? null,
        );

        if (
            identity === undefined ||
            identity.credential.status !== 'active' ||
            !passwordMatches ||
            identity.credential.passwordHash === null
        ) {
            throw new CredentialAuthenticationError();
        }

        const now = this.clock();
        const token = this.tokenGenerator.create();
        const expiresAt = new Date(now.getTime() + this.sessionDurationSeconds * 1_000);
        await this.unitOfWork.run(async ({ credentials, sessions }) => {
            await sessions.create(identity.user.id, token.digest, expiresAt);
            await credentials.markPasswordUsed(identity.credential.id, now);
        });

        return {
            expiresAt,
            token: token.token,
            user: identity.user,
        };
    }

    /**
     * Resolves the user represented by an opaque session token.
     *
     * @param token Raw token read from the HTTP-only cookie.
     * @returns The authenticated user.
     * @throws {SessionInvalidError} When the token is absent, revoked, expired, or orphaned.
     */
    public async getCurrentUser(token: string | undefined): Promise<User> {
        if (token === undefined || token.length === 0) {
            throw new SessionInvalidError();
        }

        const now = this.clock();
        const tokenDigest = this.tokenGenerator.digest(token);

        return this.unitOfWork.run(async ({ sessions, users }) => {
            const session = await sessions.findActiveByTokenDigest(tokenDigest, now);
            if (session === undefined) {
                throw new SessionInvalidError();
            }

            const user = await users.findById(session.userId);
            if (user === undefined) {
                throw new SessionInvalidError();
            }

            await sessions.touch(session.id, now);
            return user;
        });
    }

    /**
     * Revokes the session represented by an opaque token.
     *
     * @param token Raw token read from the HTTP-only cookie.
     * @returns A promise that resolves after revocation or a no-op for an unknown token.
     */
    public async signOut(token: string | undefined): Promise<void> {
        if (token === undefined || token.length === 0) {
            return;
        }

        const tokenDigest = this.tokenGenerator.digest(token);
        const revokedAt = this.clock();
        await this.unitOfWork.run(async ({ sessions }) => {
            const session = await sessions.findActiveByTokenDigest(tokenDigest, revokedAt);
            if (session !== undefined) {
                await sessions.revoke(session.id, revokedAt);
            }
        });
    }
    /**
     * Normalizes an email address before it crosses the persistence boundary.
     *
     * @param email Email address supplied by the request boundary.
     * @returns Canonical email representation used for lookup and uniqueness.
     */
    private normalizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }
}
