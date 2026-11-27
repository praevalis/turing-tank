import { randomUUID } from 'node:crypto';

import type { Selectable } from 'kysely';

import type { PasswordIdentity, User } from '@/server/identity/domain/entities';
import { UserEmailAlreadyRegisteredError } from '@/server/identity/domain/errors';
import type { UserRepository } from '@/server/identity/domain/repositories';

import type { IdentityDatabaseExecutor } from './database';
import type { UsersTable } from './tables';

type UserRow = Selectable<UsersTable>;

interface PostgresConstraintError {
    code: string;
    constraint?: string;
}

/** Persists identity users and password-identity projections through Kysely. */
export class KyselyUserRepository implements UserRepository {
    private readonly database: IdentityDatabaseExecutor;

    public constructor(database: IdentityDatabaseExecutor) {
        this.database = database;
    }

    /**
     * Creates a user account without selecting an authentication method.
     *
     * @param email Normalized email address.
     * @param displayName Display name for the user.
     * @returns The created user.
     * @throws {UserEmailAlreadyRegisteredError} When the email is already registered.
     */
    public async create(email: string, displayName: string): Promise<User> {
        try {
            const row = await this.database
                .withSchema('turing_app')
                .insertInto('users')
                .values({
                    display_name: displayName,
                    email,
                    id: randomUUID(),
                })
                .returningAll()
                .executeTakeFirstOrThrow();

            return mapUser(row);
        } catch (error: unknown) {
            throw mapIdentityPersistenceError(error);
        }
    }

    /**
     * Finds a password identity by normalized email.
     *
     * @param email Normalized email address.
     * @returns The identity when it exists, otherwise undefined.
     */
    public async findWithPasswordByEmail(email: string): Promise<PasswordIdentity | undefined> {
        const row = await this.database
            .withSchema('turing_app')
            .selectFrom('users')
            .innerJoin('credentials', 'credentials.user_id', 'users.id')
            .select([
                'users.id as user_id',
                'users.email as user_email',
                'users.display_name as user_display_name',
                'users.created_at as user_created_at',
                'users.updated_at as user_updated_at',
                'credentials.id as credential_id',
                'credentials.user_id as credential_user_id',
                'credentials.credential_type',
                'credentials.provider_key',
                'credentials.provider_subject',
                'credentials.password_hash',
                'credentials.status',
                'credentials.last_used_at',
                'credentials.created_at as credential_created_at',
                'credentials.updated_at as credential_updated_at',
            ])
            .where('users.email', '=', email)
            .where('credentials.credential_type', '=', 'password')
            .executeTakeFirst();

        if (row === undefined) {
            return undefined;
        }

        return {
            credential: {
                createdAt: row.credential_created_at,
                id: row.credential_id,
                lastUsedAt: row.last_used_at,
                passwordHash: row.password_hash,
                providerKey: row.provider_key,
                providerSubject: row.provider_subject,
                status: row.status,
                type: row.credential_type,
                updatedAt: row.credential_updated_at,
                userId: row.credential_user_id,
            },
            user: {
                createdAt: row.user_created_at,
                displayName: row.user_display_name,
                email: row.user_email,
                id: row.user_id,
                updatedAt: row.user_updated_at,
            },
        };
    }

    /**
     * Finds a user by its identifier.
     *
     * @param userId User identifier.
     * @returns The user when it exists, otherwise undefined.
     */
    public async findById(userId: string): Promise<User | undefined> {
        const row = await this.database
            .withSchema('turing_app')
            .selectFrom('users')
            .selectAll()
            .where('id', '=', userId)
            .executeTakeFirst();

        return row === undefined ? undefined : mapUser(row);
    }
}

function mapUser(row: UserRow): User {
    return {
        createdAt: row.created_at,
        displayName: row.display_name,
        email: row.email,
        id: row.id,
        updatedAt: row.updated_at,
    };
}

function mapIdentityPersistenceError(error: unknown): Error {
    if (isPostgresConstraintError(error) && error.code === '23505') {
        if (error.constraint === 'users_email_lower_key') {
            return new UserEmailAlreadyRegisteredError();
        }
    }

    return error instanceof Error ? error : new Error('Identity persistence failed.');
}

function isPostgresConstraintError(error: unknown): error is PostgresConstraintError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof error.code === 'string' &&
        (!('constraint' in error) ||
            error.constraint === undefined ||
            typeof error.constraint === 'string')
    );
}
