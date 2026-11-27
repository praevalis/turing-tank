import { TuringError } from '@/server/platform/errors';

export class UserEmailAlreadyRegisteredError extends TuringError {
    public constructor() {
        super('user_email_already_registered', 'An account with this email already exists.', {
            kind: 'state_conflict',
        });
    }
}

export class CredentialAuthenticationError extends TuringError {
    public constructor() {
        super('credential_authentication_failed', 'The email or password is incorrect.', {
            kind: 'unauthenticated',
        });
    }
}

export class SessionInvalidError extends TuringError {
    public constructor() {
        super('session_invalid', 'The session is invalid or has expired.', {
            kind: 'unauthenticated',
        });
    }
}
