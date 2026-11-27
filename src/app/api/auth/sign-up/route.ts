import { NextResponse } from 'next/server';

import { createErrorResponse } from '@/app/api/error-response';
import { parseRequestBody } from '@/app/api/parse-request-body';
import { createIdentityApplication } from '@/server/identity/composition';

import { signUpRequestSchema } from '../auth-dtos';

/** Registers a password-based identity. */
export async function POST(request: Request): Promise<Response> {
    let application: ReturnType<typeof createIdentityApplication> | undefined;

    try {
        const input = await parseRequestBody(request, signUpRequestSchema);
        application = createIdentityApplication();
        const user = await application.service.signUp(
            input.email,
            input.password,
            input.displayName,
        );

        return NextResponse.json({ data: { user } }, { status: 201 });
    } catch (error: unknown) {
        return createErrorResponse(error);
    } finally {
        await application?.close();
    }
}
