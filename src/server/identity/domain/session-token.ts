export interface SessionTokenGenerator {
    /**
     * Creates a raw opaque token and its persistence digest.
     *
     * @returns Token material for the cookie boundary and database boundary.
     */
    create(): { token: string; digest: string };

    /**
     * Computes the persistence digest for a raw token.
     *
     * @param token Raw opaque session token.
     * @returns The digest used for session lookup.
     */
    digest(token: string): string;
}
