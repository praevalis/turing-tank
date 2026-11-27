import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { sessionCookieName } from '@/app/api/auth/cookies';
import { createErrorResponse } from '@/app/api/error-response';
import { createIdentityApplication } from '@/server/identity/composition';

/** Returns the user represented by the current session cookie. */
export async function GET(): Promise<Response> {
    let application: ReturnType<typeof createIdentityApplication> | undefined;

    try {
        const cookieStore = await cookies();
        application = createIdentityApplication();
        const user = await application.service.getCurrentUser(
            cookieStore.get(sessionCookieName)?.value,
        );

        return NextResponse.json({ data: { user } });
    } catch (error: unknown) {
        return createErrorResponse(error);
    } finally {
        await application?.close();
    }
}
