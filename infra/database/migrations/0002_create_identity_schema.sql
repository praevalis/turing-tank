-- Creates user accounts, extensible credentials, and server-side authentication sessions.

CREATE TABLE turing_app.users (
    id uuid PRIMARY KEY,
    email text NOT NULL,
    display_name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX users_email_lower_key ON turing_app.users (lower(email));

CREATE TABLE turing_app.credentials (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES turing_app.users (id) ON DELETE CASCADE,
    credential_type text NOT NULL,
    provider_key text,
    provider_subject text,
    password_hash text,
    status text NOT NULL DEFAULT 'active',
    last_used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT credentials_type_values CHECK (credential_type IN ('password', 'provider')),
    CONSTRAINT credentials_status_values CHECK (status IN ('active', 'disabled')),
    CONSTRAINT credentials_shape CHECK (
        (credential_type = 'password'
            AND password_hash IS NOT NULL
            AND provider_key IS NULL
            AND provider_subject IS NULL)
        OR
        (credential_type = 'provider'
            AND password_hash IS NULL
            AND provider_key IS NOT NULL
            AND provider_subject IS NOT NULL)
    )
);

CREATE UNIQUE INDEX credentials_user_password_key
    ON turing_app.credentials (user_id)
    WHERE credential_type = 'password';

CREATE UNIQUE INDEX credentials_provider_identity_key
    ON turing_app.credentials (provider_key, provider_subject)
    WHERE credential_type = 'provider';

CREATE TABLE turing_app.auth_sessions (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES turing_app.users (id) ON DELETE CASCADE,
    token_digest text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    last_used_at timestamptz,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auth_sessions_expiry_after_creation CHECK (expires_at > created_at)
);

REVOKE ALL ON TABLE turing_app.users, turing_app.credentials, turing_app.auth_sessions FROM PUBLIC;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE turing_app.users, turing_app.credentials, turing_app.auth_sessions
    TO turing_app;
