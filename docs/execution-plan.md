# Turing Tank Execution Plan

This is the active tracker for implementation and related operational work. Keep it concise. Each slice is one checkbox with a one-line description.

A work package is a major chunk of effort. A slice is a small, independently reviewable part of a work package and should normally stay within three or four primary commits. Smaller fix and chore commits caused by the slice do not count toward that reference limit.

## WP0: Documentation, Requirements, and Architecture Planning

- [x] WP0.1 Establish the documentation foundation and collaboration rules
- [x] WP0.2 Consolidate the accepted product requirements
- [x] WP0.3 Define the system boundaries, state model, and orchestration responsibilities
- [x] WP0.4 Record the accepted architecture decisions as ADRs

## WP1: Repository and Application Foundation

- [x] WP1.1 Establish the Next.js repository shell, pnpm toolchain, strict TypeScript, formatting, linting, and testing baseline.
- [x] WP1.2 Establish client/server boundaries, runtime configuration, stable errors, structured logging, and approved nested agent guidance.
- [ ] WP1.3 Establish PostgreSQL, migration roles, local services, SQL migrations, Kysely access, and database guidance.

## Later Work Packages

The following work packages define the implementation scope. Their slices will be added when each package is prepared for execution.

- WP2: Identity, persistence, and domain foundation.
- WP3: Pitch intake, assets, and claims.
- WP4: Research and evidence.
- WP5: Investor definitions and agent capabilities.
- WP6: Session orchestration and live interaction.
- WP7: Negotiation and offers.
- WP8: Reports, replay, and founder review.
- WP9: Verification and deployment.
