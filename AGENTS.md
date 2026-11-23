# Turing Tank Agent Guidelines

These instructions apply to the whole repository. A nested `AGENTS.md` may add rules for a specific part of the project. It must not weaken these shared instructions.

## Start of Work

- Read this file and `docs/README.md` before making repository changes.
- Read the relevant documents in `docs/context/`, `docs/decisions/`, and the execution plan before changing an area.
- Treat the existing worktree as user-owned. Inspect `git status` and preserve unrelated changes.
- Search the repository before creating a new document, convention, or implementation pattern.

## Documentation Authority

- `docs/` is the single repository location for stable project documentation in Markdown.
- `docs/context/` contains current source-of-truth context. Update it when an accepted requirement or design changes.
- `docs/decisions/` preserves the reasoning behind important decisions. Keep each record short and use exactly three small sections: `Context`, `Decisions`, and `Consequences`.
- `docs/bin/` is local and git ignored. Do not use it for canonical project decisions.
- Remove a directory's `.gitkeep` placeholder in the same change that adds its first real document.
- `docs/README.md` must index stable documents and explain any important provisional inputs.
- Provisional documents are useful context, but they do not override an explicitly accepted decision.

## Collaboration Rules

- Separate decisions, hypotheses, missing information, and inconsistencies.
- Do not silently turn a hypothesis into a requirement or fill a major product gap without the owner's input.
- Discuss consequential product decisions one at a time.
- Once a decision is accepted, treat it as settled and do not ask the same question again unless new evidence creates a genuine conflict.
- Challenge assumptions with concrete tradeoffs, especially when a choice affects scope, trust, quality, or evaluation.
- Keep product requirements distinct from implementation details. Record implementation choices only after the relevant product behavior is understood.
- Do not begin application implementation while the requirements or architecture phase is explicitly still in progress.

## Work Packages and Slices

- Track development and related operational work in `docs/execution-plan.md`.
- A work package is a major chunk of effort, such as repository scaffolding or an investor workflow.
- A slice is one small, independently reviewable part of a work package.
- Keep each slice to roughly three or four primary commits at most. Smaller fix and chore commits caused by the slice are allowed.
- Keep the execution plan concise. Use one checkbox and one-line description per slice.
- Update the execution plan when a slice starts, changes scope, or is completed.

## Change Discipline

- Keep changes scoped to the requested work.
- Use `apply_patch` for local file edits.
- Prefer reversible changes and avoid destructive commands.
- Verify edited documents, links, and relevant checks before handing work back.
- Do not add dependencies, services, or external integrations without a clear requirement and explicit scope.
