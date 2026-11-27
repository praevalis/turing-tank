import { TuringError } from './turing-error';

export class InvalidRequestError extends TuringError {
    public constructor() {
        super('invalid_request', 'The request body is invalid.', {
            kind: 'malformed_request',
        });
    }
}
