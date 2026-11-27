import type { DatabaseConnection, DatabaseTransaction } from '@/server/platform/database';

import type { AuthSessionsTable, CredentialsTable, UsersTable } from './tables';

/** Kysely table map for identity persistence. */
export interface IdentityDatabase {
    auth_sessions: AuthSessionsTable;
    credentials: CredentialsTable;
    users: UsersTable;
}

/** Database connection or transaction accepted by an identity repository adapter. */
export type IdentityDatabaseExecutor =
    DatabaseConnection<IdentityDatabase> | DatabaseTransaction<IdentityDatabase>;
