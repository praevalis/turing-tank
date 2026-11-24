import type { TuringErrorKind, TuringErrorOptions } from './types';

/**
 * Base class for expected domain and application failures.
 *
 * The code is stable and machine-readable. The kind describes the failure semantics without
 * coupling the error to HTTP. The message must be safe for a transport boundary to return, while
 * the optional cause remains server-side diagnostic context.
 */
export abstract class TuringError extends Error {
    public readonly code: string;

    public readonly kind: TuringErrorKind;

    public constructor(code: string, message: string, options: TuringErrorOptions) {
        super(message, options);
        this.name = new.target.name;
        this.code = code;
        this.kind = options.kind;
    }
}
