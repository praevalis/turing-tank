# Next.js application guidelines

These rules apply to `src/app/` in addition to the repository guidelines. This directory is the Next.js application boundary. It translates HTTP and browser interactions into calls to server-side application services; it is not a second home for domain logic.

## Routing and server boundaries

- Keep route handlers thin. They validate transport input, establish request context, call server services, and translate results into HTTP responses.
- Keep domain behavior, repository calls, provider orchestration, and recovery policy out of route handlers and React components.
- Follow REST conventions for resource endpoints. Ask for a decision before introducing an intentional exception.
- Keep private configuration and server-only imports out of browser code. Client modules may use only intentionally public configuration.
- Use stable server error codes for programmatic behavior. Do not parse human-readable error messages or expose stack traces and raw upstream responses.

## Rendering and client state

- Treat Server Components as the default.
- Add Client Components only when browser interaction, local state, timers, or streaming UI require them.
- Use function components and hooks. Prefix custom hooks with `use`.
- Keep state as close as practical to its consumers. Lift it only when multiple components genuinely share ownership.
- Use discriminated unions for finite UI states instead of combinations of loosely related booleans.
- Do not use effects for derived state. Compute derived values during rendering unless synchronization with an external system is required.
- Do not add memoization pre-emptively. Use memoization only when referential stability is required or a measured performance issue exists.
- Use canonical Tailwind classes where available instead of equivalent arbitrary values.

## Application organization

- Organize product code by feature. A feature may own its components, hooks, state, view models, API calls, and tests.
- Keep application composition, providers, routing, and global error handling under `src/app`.
- Keep shared UI components presentational and reusable. Keep domain behavior out of them.
- Do not create shared abstractions until at least two concrete consumers establish the common behavior.
- Reuse the shared component library instead of creating feature-local copies of an existing component.
- Add barrel files only for deliberate module boundaries.

## Validation, accessibility, and errors

- Keep authoritative business validation on the server. Client validation may provide immediate feedback but must not redefine server rules.
- Preserve user input after recoverable submission failures and prevent duplicate submissions while an operation is pending.
- Handle loading, empty, error, stale, and success states explicitly when a feature has those states.
- Use semantic HTML before adding ARIA attributes.
- Make interactive controls keyboard accessible and give them accessible names.
- Associate form fields with visible labels and expose validation errors accessibly.
- Preserve focus intentionally across dialogs, navigation, validation failures, and asynchronous mutations.
- Do not communicate status using color alone.

## TypeScript and documentation

- Use precise types at component, hook, state, and external-data boundaries.
- Use `unknown` for untrusted values and narrow it before use.
- Avoid broad assertions, non-null assertions, unchecked casts, and lint or TypeScript suppression directives. Fix the underlying design issue when practical.
- Allow inference for obvious local values and add explicit types where they document a public contract or prevent widening.
- Use the repository import ordering and four-space formatting rules.
- Add JSDoc to public hooks and top-level utilities. React components and nested functions do not need JSDoc. Document non-obvious private helpers and security-sensitive behavior.

## Tests

- Test observable behavior rather than component implementation details.
- Prefer accessible queries such as roles, labels, and visible text.
- Keep tests deterministic and avoid mocking internal implementation details merely to simplify a test.
- Add browser workflow tests when a real cross-feature workflow exists; do not add them for static scaffolding.
- Do not test third-party library behavior through thin wrappers.
