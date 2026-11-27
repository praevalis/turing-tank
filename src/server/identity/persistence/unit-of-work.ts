import type {
    IdentityRepositorySet,
    IdentityUnitOfWork,
} from '@/server/identity/domain/repositories';
import { runInTransaction } from '@/server/platform/database';
import type { DatabaseConnection } from '@/server/platform/database';

import { KyselyAuthSessionRepository } from './auth-session-repository';
import { KyselyCredentialRepository } from './credential-repository';
import type { IdentityDatabase } from './database';
import { KyselyUserRepository } from './user-repository';

/** Composes identity repository adapters over one database transaction. */
export class KyselyIdentityUnitOfWork implements IdentityUnitOfWork {
    private readonly database: DatabaseConnection<IdentityDatabase>;

    public constructor(database: DatabaseConnection<IdentityDatabase>) {
        this.database = database;
    }

    /**
     * Runs identity repository work inside one short Kysely transaction.
     *
     * @param operation Repository operations to execute atomically.
     * @returns The value returned by the operation after commit.
     */
    public async run<Result>(
        operation: (repositories: IdentityRepositorySet) => Promise<Result>,
    ): Promise<Result> {
        return runInTransaction(this.database, async (transaction) =>
            operation({
                credentials: new KyselyCredentialRepository(transaction),
                sessions: new KyselyAuthSessionRepository(transaction),
                users: new KyselyUserRepository(transaction),
            }),
        );
    }
}
