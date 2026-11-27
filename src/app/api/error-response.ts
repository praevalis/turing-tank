import { NextResponse } from 'next/server';

import { TuringError, type TuringErrorKind } from '@/server/platform/errors';

type HttpStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500;

const statusByErrorKind: Readonly<Record<TuringErrorKind, HttpStatus>> = {
    internal_failure: 500,
    invalid_input: 422,
    malformed_request: 400,
    missing_resource: 404,
    state_conflict: 409,
    unauthenticated: 401,
    unauthorized: 403,
};

export interface ErrorResponse {
    body: {
        error: {
            code: string;
            message: string;
            request_id?: string;
        };
    };
    status: HttpStatus;
}

/**
 * Converts an expected or unexpected failure into the HTTP error contract.
 *
 * @param error Failure raised by application code or an external dependency.
 * @param requestId Optional identifier associated with the request.
 * @returns An HTTP status and safe response body.
 */
function mapError(error: unknown, requestId?: string): ErrorResponse {
    if (error instanceof TuringError) {
        return {
            status: statusByErrorKind[error.kind],
            body: {
                error: {
                    code: error.code,
                    message: error.message,
                    ...(requestId === undefined ? {} : { request_id: requestId }),
                },
            },
        };
    }

    return {
        status: 500,
        body: {
            error: {
                code: 'internal_error',
                message: 'An unexpected error occurred.',
                ...(requestId === undefined ? {} : { request_id: requestId }),
            },
        },
    };
}

/**
 * Converts an application failure into a JSON API response.
 *
 * @param error Failure raised by application code or an external dependency.
 * @returns A JSON response containing the stable error body and HTTP status.
 */
export function createErrorResponse(error: unknown): Response {
    const response = mapError(error);

    return NextResponse.json(response.body, {
        status: response.status,
    });
}
