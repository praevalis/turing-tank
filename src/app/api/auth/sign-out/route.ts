import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getExpiredSessionCookieOptions, sessionCookieName } from '@/app/api/auth/cookies';
import { createErrorResponse } from '@/app/api/error-response';
import { createIdentityApplication } from '@/server/identity/composition';

/** Revokes the current session and clears its client cookie. */
export async function POST(): Promise<Response> {
    let application: ReturnType<typeof createIdentityApplication> | undefined;

    try {
        const cookieStore = await cookies();
        application = createIdentityApplication();
        await application.service.signOut(cookieStore.get(sessionCookieName)?.value);

        const response = new NextResponse(null, { status: 204 });
        response.cookies.set(sessionCookieName, '', getExpiredSessionCookieOptions());
        return response;
    } catch (error: unknown) {
        return createErrorResponse(error);
    } finally {
        await application?.close();
    }
}
