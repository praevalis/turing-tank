import { NextResponse } from 'next/server';

import { getSessionCookieOptions, sessionCookieName } from '@/app/api/auth/cookies';
import { createErrorResponse } from '@/app/api/error-response';
import { parseRequestBody } from '@/app/api/parse-request-body';
import { createIdentityApplication } from '@/server/identity/composition';

import { signInRequestSchema } from '../auth-dtos';

/** Creates a server-side session from password credentials. */
export async function POST(request: Request): Promise<Response> {
    let application: ReturnType<typeof createIdentityApplication> | undefined;

    try {
        const input = await parseRequestBody(request, signInRequestSchema);
        application = createIdentityApplication();
        const session = await application.service.signIn(input.email, input.password);
        const response = NextResponse.json({ data: { user: session.user } });

        response.cookies.set(
            sessionCookieName,
            session.token,
            getSessionCookieOptions(session.expiresAt),
        );

        return response;
    } catch (error: unknown) {
        return createErrorResponse(error);
    } finally {
        await application?.close();
    }
}
