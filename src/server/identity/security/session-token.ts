import { createHash, randomBytes } from 'node:crypto';

import type { SessionTokenGenerator } from '@/server/identity/domain/session-token';

/**
 * Generates opaque session tokens and the digests stored by the application.
 *
 * @remarks The raw token is returned only to the caller that sets the HTTP-only cookie. The
 * database receives the one-way digest, so a database read does not reveal usable sessions.
 */
export class CryptographicSessionTokenGenerator implements SessionTokenGenerator {
    /**
     * Creates a raw opaque token and its one-way persistence digest.
     *
     * @returns The raw token for the client and its digest for storage.
     */
    public create(): { token: string; digest: string } {
        const token = randomBytes(32).toString('base64url');

        return { digest: this.digest(token), token };
    }

    /**
     * Computes the persistence digest for a raw session token.
     *
     * @param token Raw opaque session token.
     * @returns A SHA-256 hexadecimal digest.
     */
    public digest(token: string): string {
        return createHash('sha256').update(token, 'utf8').digest('hex');
    }
}
