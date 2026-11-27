import { describe, expect, it } from 'vitest';

import { Argon2PasswordHasher } from '@/server/identity/security/argon2-password-hasher';

describe('Argon2PasswordHasher', () => {
    it('creates a PHC hash and verifies matching and non-matching passwords', async () => {
        const hasher = new Argon2PasswordHasher();
        const hash = await hasher.hash('correct password');

        await expect(hash).toMatch(/^\$argon2id\$/u);
        await expect(hasher.verify('correct password', hash)).resolves.toBe(true);
        await expect(hasher.verify('wrong password', hash)).resolves.toBe(false);
    });

    it('performs verification work when no stored hash exists', async () => {
        const hasher = new Argon2PasswordHasher();

        await expect(hasher.verify('any password', null)).resolves.toBe(false);
    });
});
