# Server implementation guidelines

These rules apply to `src/server/` in addition to the repository guidelines. This directory contains server-only product behavior and shared server mechanics. It must not become a generic dumping ground for code that belongs to a product module or the browser.

## Boundaries

- Keep each product domain under its owning server module.
- Keep domain rules in `domain/`, use-case coordination in `services/`, and data access in `repositories/`.
- A service may use a repository directly for a read-only projection when constructing a domain entity is unnecessary. State-changing operations must pass through the domain rules they affect.
- Keep shared server mechanics such as configuration, database access, errors, logging, and request context under `platform/`.
- Keep provider-specific code behind explicit interfaces and do not let provider response shapes become domain types.
- Do not import browser components, client state, or client configuration into server modules.

## Design and dependency boundaries

- Keep one-off use-case orchestration in the service method that owns it.
- Use TypeScript interfaces for server dependency contracts. Do not use abstract base classes only to define an interface.
- Apply dependency inversion to stateful collaborators and external integrations, not to every function or value object.
- Keep read models purpose-built. Do not create full domain entities solely to satisfy a projection query.

## Input, schemas, and errors

- Validate untrusted values at the server boundary before passing them to services or repositories.
- Use runtime schemas at external boundaries and explicit domain types inside the domain.
- Name transport schemas by entity and operation: `XxxCreate`, `XxxRead`, and `XxxUpdate`. Use a verb suffix only when one of those names does not express the contract.
- Make intentional domain and application failures inherit from `TuringError`.
- Name domain error classes with `<Entity><Condition>Error`. Use `<Entity><Verb>Error` only when the failure is specifically operation-based and cannot be expressed as a condition.
- Mirror domain error class names in stable snake_case codes.
- Keep domain errors independent of HTTP and infrastructure terminology. Platform-owned errors may use transport-level names such as `InvalidRequestError`.
- Keep application error codes deterministic, stable, and in snake case. Do not derive them from human-readable messages.
- Return human-readable messages with the appropriate HTTP status, but do not expose stack traces, credentials, raw upstream responses, or infrastructure details.
- Represent expected failures explicitly. Do not swallow rejected promises or use empty catch blocks.

## Logging and security

- Use structured logs with request, session, and workflow identifiers where available.
- Use the exported root logger at composition boundaries. Inject `Logger` or a child logger into services and repositories that genuinely log; do not import the singleton throughout application classes.
- Redact credentials, tokens, authorization values, prompts, uploaded content, and other sensitive data before logging.
- Keep recovery behavior explicit. Retry only operations that are safe to retry, and do not hide a failed mutation behind an automatic retry.
- Keep application state authoritative over orchestration graph state.
- Keep persistence of application state separate from orchestration checkpoint state.

## TypeScript and documentation

- Use strict TypeScript and current stable library APIs. Do not carry forward deprecated syntax.
- Do not use `any`, unparameterized containers, broad assertions, non-null assertions, or unchecked casts when a precise alternative is practical.
- Use `unknown` for untrusted values and narrow it before use.
- Allow inference for obvious local values. Add explicit types where they document a public contract or prevent widening.
- Use `type` for unions and mapped types. Use `interface` for object contracts intended to be implemented or extended.
- Organize imports as standard library, third-party packages, then application imports. Use relative imports within the same package and the `@` alias across application boundaries.
- Add JSDoc to public services, utilities, classes, and methods. Include parameters, returns, and only meaningful errors that can escape.

## Tests

- Test domain rules, service behavior, repository behavior, error translation, and integration boundaries that belong to this project.
- Do not test third-party library behavior through thin wrappers.
- Prefer deterministic tests and mock external providers at their boundary.
- Add tests for meaningful success, failure, retry, authorization, and recovery paths when the production code supports them.
- Do not add tests solely to increase coverage.
