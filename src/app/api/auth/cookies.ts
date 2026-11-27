/** Name of the HTTP-only cookie carrying the raw session token. */
export const sessionCookieName = 'turing_session';

/**
 * Builds the options for setting an active session cookie.
 *
 * @param expires Session expiration timestamp.
 * @returns Cookie options suitable for a secure HTTP-only session cookie.
 */
export function getSessionCookieOptions(expires: Date): {
    expires: Date;
    httpOnly: true;
    path: '/';
    sameSite: 'lax';
    secure: boolean;
} {
    return {
        expires,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    };
}

/**
 * Builds the options that remove the session cookie from the client.
 *
 * @returns Expired cookie options suitable for clearing the session cookie.
 */
export function getExpiredSessionCookieOptions(): {
    expires: Date;
    httpOnly: true;
    maxAge: 0;
    path: '/';
    sameSite: 'lax';
    secure: boolean;
} {
    return {
        expires: new Date(0),
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    };
}
