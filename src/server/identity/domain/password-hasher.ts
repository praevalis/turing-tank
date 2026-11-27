export interface PasswordHasher {
    /**
     * Hashes a password using an adaptive password-hashing algorithm.
     *
     * @param password Plaintext password supplied at an authentication boundary.
     * @returns A self-describing password hash suitable for persistence.
     */
    hash(password: string): Promise<string>;

    /**
     * Verifies a password without revealing whether the supplied hash exists.
     *
     * @param password Plaintext password supplied at an authentication boundary.
     * @param passwordHash Stored password hash, or null when the identity was not found.
     * @returns Whether the password is valid.
     */
    verify(password: string, passwordHash: string | null): Promise<boolean>;
}
