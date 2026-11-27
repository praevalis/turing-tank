import { describe, expect, it } from 'vitest';

import { IdentityService } from '@/server/identity/application/identity-service';
import type {
    AuthSession,
    Credential,
    PasswordIdentity,
    User,
} from '@/server/identity/domain/entities';
import {
    CredentialAuthenticationError,
    SessionInvalidError,
} from '@/server/identity/domain/errors';
import type { PasswordHasher } from '@/server/identity/domain/password-hasher';
import type {
    AuthSessionRepository,
    CredentialRepository,
    IdentityRepositorySet,
    IdentityUnitOfWork,
    UserRepository,
} from '@/server/identity/domain/repositories';
import type { SessionTokenGenerator } from '@/server/identity/domain/session-token';

const fixedNow = new Date('2026-11-27T10:00:00.000Z');
const sessionDurationSeconds = 2_592_000;

describe('IdentityService', () => {
    it('registers a normalized email with a hashed password', async () => {
        const unitOfWork = new InMemoryIdentityUnitOfWork();
        const passwordHasher = new FakePasswordHasher();
        const service = createService({ passwordHasher, unitOfWork });

        const user = await service.signUp(
            '  Ada@Example.com ',
            'a sufficiently long password',
            '  Ada Lovelace  ',
        );

        expect(user.email).toBe('ada@example.com');
        expect(user.displayName).toBe('Ada Lovelace');
        expect(unitOfWork.credentials.createdPasswordHash).toBe(
            'hashed:a sufficiently long password',
        );
    });

    it('creates a session after successful password authentication', async () => {
        const unitOfWork = new InMemoryIdentityUnitOfWork();
        const passwordHasher = new FakePasswordHasher();
        const identity = await createIdentity(unitOfWork, 'ada@example.com');
        const service = createService({ passwordHasher, unitOfWork });

        const result = await service.signIn(identity.user.email, 'correct password');

        expect(result.user.id).toBe(identity.user.id);
        expect(result.token).toBe('raw-session-token');
        expect(unitOfWork.sessions.created?.tokenDigest).toBe('digest:raw-session-token');
        expect(unitOfWork.sessions.created?.expiresAt).toEqual(
            new Date('2026-12-27T10:00:00.000Z'),
        );
        expect(unitOfWork.credentials.lastUsedAt).toEqual(fixedNow);
    });

    it('does not reveal whether an email exists when authentication fails', async () => {
        const passwordHasher = new FakePasswordHasher();
        const service = createService({ passwordHasher });

        await expect(
            service.signIn('missing@example.com', 'wrong password'),
        ).rejects.toBeInstanceOf(CredentialAuthenticationError);
        expect(passwordHasher.verifiedHashes).toEqual([null]);
    });

    it('resolves and revokes opaque sessions', async () => {
        const unitOfWork = new InMemoryIdentityUnitOfWork();
        const identity = await createIdentity(unitOfWork, 'ada@example.com');
        const service = createService({ unitOfWork });
        const authenticated = await service.signIn(identity.user.email, 'correct password');

        await expect(service.getCurrentUser(authenticated.token)).resolves.toMatchObject({
            id: identity.user.id,
        });
        await service.signOut(authenticated.token);
        await expect(service.getCurrentUser(authenticated.token)).rejects.toBeInstanceOf(
            SessionInvalidError,
        );
    });
});

async function createIdentity(
    unitOfWork: InMemoryIdentityUnitOfWork,
    email: string,
): Promise<PasswordIdentity> {
    return unitOfWork.run(async ({ credentials, users }) => {
        const user = await users.create(email, 'Ada Lovelace');
        const credential = await credentials.createPassword(user.id, 'stored-hash');

        return { credential, user };
    });
}

function createService(
    overrides: {
        passwordHasher?: PasswordHasher;
        unitOfWork?: IdentityUnitOfWork;
    } = {},
): IdentityService {
    return new IdentityService(
        overrides.unitOfWork ?? new InMemoryIdentityUnitOfWork(),
        overrides.passwordHasher ?? new FakePasswordHasher(),
        new FakeTokenGenerator(),
        sessionDurationSeconds,
        () => fixedNow,
    );
}

class FakePasswordHasher implements PasswordHasher {
    public verifiedHashes: Array<string | null> = [];

    public async hash(password: string): Promise<string> {
        return `hashed:${password}`;
    }

    public async verify(password: string, passwordHash: string | null): Promise<boolean> {
        this.verifiedHashes.push(passwordHash);
        return password === 'correct password';
    }
}

class FakeTokenGenerator implements SessionTokenGenerator {
    public create(): { token: string; digest: string } {
        return { digest: 'digest:raw-session-token', token: 'raw-session-token' };
    }

    public digest(token: string): string {
        return `digest:${token}`;
    }
}

class InMemoryIdentityUnitOfWork implements IdentityUnitOfWork, IdentityRepositorySet {
    public readonly credentials = new InMemoryCredentialRepository();

    public readonly sessions = new InMemorySessionRepository();

    public readonly users = new InMemoryUserRepository(this.credentials);

    public async run<Result>(
        operation: (repositories: IdentityRepositorySet) => Promise<Result>,
    ): Promise<Result> {
        return operation(this);
    }
}

class InMemoryUserRepository implements UserRepository {
    private readonly usersById = new Map<string, User>();
    private nextUserId = 1;

    public constructor(private readonly credentials: InMemoryCredentialRepository) {}

    public async create(email: string, displayName: string): Promise<User> {
        const now = fixedNow;
        const user: User = {
            createdAt: now,
            displayName,
            email,
            id: `user-${this.nextUserId++}`,
            updatedAt: now,
        };
        this.usersById.set(user.id, user);
        return user;
    }

    public async findWithPasswordByEmail(email: string): Promise<PasswordIdentity | undefined> {
        const user = [...this.usersById.values()].find((candidate) => candidate.email === email);
        if (user === undefined) {
            return undefined;
        }

        const credential = this.credentials.find((candidate) => candidate.userId === user.id);
        return credential === undefined ? undefined : { credential, user };
    }

    public async findById(userId: string): Promise<User | undefined> {
        return this.usersById.get(userId);
    }
}

class InMemoryCredentialRepository implements CredentialRepository {
    public createdPasswordHash: string | undefined;

    public lastUsedAt: Date | undefined;

    private readonly credentials: Credential[] = [];

    public async createPassword(userId: string, passwordHash: string): Promise<Credential> {
        this.createdPasswordHash = passwordHash;
        const now = fixedNow;
        const credential: Credential = {
            createdAt: now,
            id: 'credential-1',
            lastUsedAt: null,
            passwordHash,
            providerKey: null,
            providerSubject: null,
            status: 'active',
            type: 'password',
            updatedAt: now,
            userId,
        };
        this.credentials.push(credential);
        return credential;
    }

    public async markPasswordUsed(_credentialId: string, usedAt: Date): Promise<void> {
        this.lastUsedAt = usedAt;
    }

    public find(predicate: (credential: Credential) => boolean): Credential | undefined {
        return this.credentials.find(predicate);
    }
}

class InMemorySessionRepository implements AuthSessionRepository {
    public created: AuthSession | undefined;
    private revokedSessionId: string | undefined;

    public async create(
        userId: string,
        tokenDigest: string,
        expiresAt: Date,
    ): Promise<AuthSession> {
        const now = fixedNow;
        this.created = {
            createdAt: now,
            expiresAt,
            id: 'session-1',
            lastUsedAt: null,
            revokedAt: null,
            tokenDigest,
            updatedAt: now,
            userId,
        };
        return this.created;
    }

    public async findActiveByTokenDigest(
        tokenDigest: string,
        now: Date,
    ): Promise<AuthSession | undefined> {
        if (
            this.created === undefined ||
            this.created.tokenDigest !== tokenDigest ||
            this.revokedSessionId === this.created.id ||
            this.created.expiresAt <= now
        ) {
            return undefined;
        }

        return this.created;
    }

    public async revoke(sessionId: string, revokedAt: Date): Promise<void> {
        this.revokedSessionId = sessionId;
        if (this.created !== undefined) {
            this.created = { ...this.created, revokedAt, updatedAt: revokedAt };
        }
    }

    public async touch(sessionId: string, usedAt: Date): Promise<void> {
        if (this.created?.id === sessionId) {
            this.created = { ...this.created, lastUsedAt: usedAt, updatedAt: usedAt };
        }
    }
}
