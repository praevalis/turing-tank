import type { Generated } from 'kysely';

import type { CredentialStatus, CredentialType } from '@/server/identity/domain/enums';

export interface UsersTable {
    id: string;
    email: string;
    display_name: string;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
}

export interface CredentialsTable {
    id: string;
    user_id: string;
    credential_type: CredentialType;
    provider_key: string | null;
    provider_subject: string | null;
    password_hash: string | null;
    status: CredentialStatus;
    last_used_at: Date | null;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
}

export interface AuthSessionsTable {
    id: string;
    user_id: string;
    token_digest: string;
    expires_at: Date;
    last_used_at: Date | null;
    revoked_at: Date | null;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
}
