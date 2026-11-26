# Turing Tank Documentation

This directory is the home for project documentation written in Markdown.

Read the repository-root `AGENTS.md` and this index before making changes that affect project behavior, architecture, or execution.

## Structure

- `context/` contains stable project context and source-of-truth documents such as product requirements, architecture, and the design system.
- `decisions/` contains short Architecture Decision Records and other durable decisions. Each record has three sections: `Context`, `Decisions`, and `Consequences`.
- `execution-plan.md` tracks work packages, slices, and related operational work such as deployment.

## Stable Documents

- [Project context](context/project-context.md)
- [Architecture](context/architecture.md)
- [Data model](context/data-model.md)
- [Design system](context/design-system.md)

## Accepted Architecture Decisions

- [Application state is authoritative over graph state](decisions/0001-application-state-authority.md)
- [Coordinate reusable investor subgraphs from a session graph](decisions/0002-orchestrator-and-investor-subgraphs.md)
- [Use Kysely for typed persistence queries](decisions/0003-kysely-over-prisma.md)

## Work Tracking

Work is organized into work packages such as `WP0` and `WP1`. Each work package is divided into slices such as `WP1.1`. A slice should normally represent no more than three or four primary commits. Smaller fix and chore commits caused by that work do not count toward the limit.

The active tracker is [execution-plan.md](execution-plan.md).
