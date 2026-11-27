import argon2 from 'argon2';

import type { PasswordHasher } from '@/server/identity/domain/password-hasher';

const argon2Options: argon2.HashOptions = {
    hashLength: 32,
    memoryCost: 19_456,
    parallelism: 1,
    timeCost: 2,
    type: argon2.argon2id,
};

// Keeps unknown-account verification on the same expensive Argon2 path as a stored credential.
const dummyPasswordHash =
    '$argon2id$v=19$m=19456,t=2,p=1$2iH9tM2S6n+bpPPs4ooOAQ$' +
    'JvIRzu3Ui85E/3R+O7kNiTCvzGEgJhzPPE3ZOaW5nAo';

/**
 * Argon2id password hashing adapter.
 *
 * @remarks Password verification also performs work against a fixed dummy hash when the
 * account lookup did not find an identity, avoiding an unnecessary account-existence timing
 * signal. The stored hash contains the algorithm parameters and salt in PHC format.
 */
export class Argon2PasswordHasher implements PasswordHasher {
    /**
     * Hashes a plaintext password with Argon2id.
     *
     * @param password Plaintext password supplied by the request boundary.
     * @returns A self-describing Argon2id password hash.
     */
    public async hash(password: string): Promise<string> {
        return argon2.hash(password, argon2Options);
    }

    /**
     * Verifies a plaintext password against a stored hash or the dummy hash.
     *
     * @param password Plaintext password supplied by the request boundary.
     * @param passwordHash Stored password hash, or null when no identity was found.
     * @returns Whether the password matches the selected hash.
     */
    public async verify(password: string, passwordHash: string | null): Promise<boolean> {
        try {
            return await argon2.verify(passwordHash ?? dummyPasswordHash, password);
        } catch {
            return false;
        }
    }
}
