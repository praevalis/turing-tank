# Turing Tank Agent Guidelines

These instructions apply to the whole repository. A nested `AGENTS.md` may add detail for its directory, but it must not weaken or contradict these rules.

## Scope and precedence

- Treat accepted product requirements and ADRs as authoritative for behavior and architecture.
- Treat this file as the repository-wide implementation agreement.
- A nested `AGENTS.md` may make these rules more specific for its directory, but may not weaken, contradict, or silently reinterpret them.
- Treat the existing worktree as user-owned. Preserve unrelated changes even when they are incomplete or unfamiliar.

## Working agreement

- Work on one execution-plan slice at a time unless the owner explicitly groups slices.
- Keep each slice independently reviewable and suitable for a meaningful change.
- Do not create speculative modules, abstractions, directories, dependencies, services, or integrations.
- Do not silently resolve a major product or architecture gap. Present the tradeoff and ask the owner to decide.
- Once a decision is accepted, treat it as settled unless new repository evidence creates a genuine conflict.
- Do not commit changes unless the owner explicitly asks for a commit.

## Before changing the repository

- Read this file and `docs/README.md` before making repository changes.
- Read the relevant documents in `docs/context/`, `docs/decisions/`, and `docs/execution-plan.md` before changing an area.
- Inspect `git status` before making changes.
- Search the repository before creating a document, convention, abstraction, or implementation pattern.

## Project records

- `docs/context/` contains current product and architecture context. Update it when an accepted requirement or design changes.
- `docs/decisions/` records durable architectural reasoning. Each ADR uses exactly three sections: `Context`, `Decisions`, and `Consequences`.
- `docs/execution-plan.md` is the work tracker. Keep it concise, with one checkbox and one-line description per slice.
- Provisional documents provide context but do not override accepted requirements or ADRs.
- Separate product requirements, architecture decisions, implementation conventions, and hypotheses.

## Documentation

- `docs/` is the repository location for stable project documentation in Markdown.
- `docs/README.md` must index stable documents and explain important provisional inputs.
- Propose changes to root guidance or canonical documentation for owner approval before applying them, unless the owner has already explicitly approved the change.

## Repository architecture

- This project is one deployable Next.js application with explicit internal boundaries.
- `src/app/` owns Next.js routing, rendering, request translation, and application composition. It must not become the home for domain or data-access logic.
- `src/server/` owns server-only domain behavior, services, repositories, orchestration, and shared server mechanics.
- Keep browser-safe configuration separate from private server configuration. Private values must never enter client bundles.
- Keep infrastructure concerns behind explicit boundaries and add a directory only when an active slice has a concrete use for it.
- Use `docker-compose.yml` for local container topology and `.yml` rather than `.yaml` for YAML files.
- Use `.env.template` as the checked-in example configuration file. Never commit local environment files or secrets.

## Design and implementation

- Use object-oriented and SOLID techniques when they create a clear, testable boundary. Favor composition over inheritance and keep classes focused.
- Use typed interfaces for dependency contracts where a real boundary exists. Avoid marker interfaces, speculative abstractions, pass-through services, and wrappers without a current consumer.
- Keep private helpers only when they represent shared behavior or one cohesive rule. Do not extract helpers that only forward a call or construct one value.
- Validate untrusted input at external boundaries and use explicit domain types internally.
- Use the current stable version of each dependency and its recommended syntax. Do not carry forward deprecated library APIs.
- Do not use `any`, unparameterized containers, broad assertions, non-null assertions, or unchecked casts when a precise alternative is practical.
- Do not suppress lint or TypeScript errors with directives when the underlying issue can be fixed. If a directive is justified because the root-cause fix would add disproportionate complexity, ask the owner first and add a concise explanation beside the directive after approval.
- Use `type` for unions and mapped types. Use `interface` for object contracts intended to be implemented or extended.
- Use four spaces for indentation, no literal tab characters, and the repository formatter as the formatting authority.
- Organize imports as standard library, third-party packages, then application imports. Use the `@` alias for imports outside the same package.
- Add barrel files only when they define a deliberate module boundary, not merely to shorten imports.
- Use stable snake_case error codes with HTTP statuses and human-readable messages. Clients must not parse human-readable messages.

## Code comments and JSDoc

- Add comments for non-obvious decisions, invariants, security constraints, and complex control flow.
- Keep comments concise and functional. Do not narrate straightforward code or mention work packages and slices in source comments.
- Add JSDoc to public hooks, utilities, services, classes, and methods. Document parameters, returns, and only meaningful errors that can escape.
- Constructors do not require separate JSDoc.
- React components and nested functions are exempt from JSDoc requirements. Non-obvious private helpers still require focused documentation.

## Testing and verification

- Add tests for project behavior and meaningful failure paths. Do not test third-party library behavior merely through a thin wrapper.
- Prefer behavior-oriented, deterministic tests and mock external boundaries rather than internal implementation details.
- When mock or fixture behavior is repeated, extract a reusable fixture instead of duplicating the setup.
- Do not add tests solely to increase coverage or test obvious framework behavior.
- Run targeted checks while iterating and the relevant full application checks before declaring a slice complete.
- Do not mark a slice complete until its implementation and proportionate verification pass.

## Change discipline

- Keep changes scoped to the requested slice and avoid broad cleanup.
- Preserve unrelated worktree changes.
- Use `apply_patch` for local file edits.
- Prefer reversible changes and avoid destructive commands.
- Do not add dependencies, services, or external integrations without a clear requirement and explicit scope.
- Do not commit changes unless the owner explicitly asks for a commit.
