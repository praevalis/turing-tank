import { z } from 'zod';

import { InvalidRequestError } from '@/server/platform/errors';

/**
 * Parses a JSON request body against a transport schema.
 *
 * @typeParam Schema Zod schema type used to validate the body.
 * @param request Incoming request.
 * @param schema Zod schema for the endpoint body.
 * @returns The validated request body.
 * @throws {InvalidRequestError} When the body is not valid JSON or fails the schema.
 */
export async function parseRequestBody<Schema extends z.ZodType>(
    request: Request,
    schema: Schema,
): Promise<z.output<Schema>> {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw new InvalidRequestError();
    }

    const result = schema.safeParse(body);
    if (!result.success) {
        throw new InvalidRequestError();
    }

    return result.data;
}
