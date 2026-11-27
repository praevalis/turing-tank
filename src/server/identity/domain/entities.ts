import type { CredentialStatus, CredentialType } from './enums';

export interface User {
    id: string;
    email: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Credential {
    id: string;
    userId: string;
    type: CredentialType;
    providerKey: string | null;
    providerSubject: string | null;
    passwordHash: string | null;
    status: CredentialStatus;
    lastUsedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PasswordIdentity {
    user: User;
    credential: Credential;
}

export interface AuthSession {
    id: string;
    userId: string;
    tokenDigest: string;
    expiresAt: Date;
    lastUsedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
