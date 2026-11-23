# ADR 0001: Application State Is Authoritative Over Graph State

## Context

Turing Tank uses LangGraph to run work that can take time, call tools, and resume after a failure. A checkpoint is useful for continuing that work, but it can contain partial results, failed attempts, or nested investor state that the application has not accepted. A stream can also end before the workflow has committed a domain change.

The product needs durable history and business rules that behave consistently when a stream disconnects, a graph retries, or a model provider changes. Those rules cannot depend on whichever snapshot happens to be available in a workflow checkpoint.

## Decisions

The application is the source of truth for accepted facts, evidence, questions, answers, investor positions, offers, reports, limits, and domain transitions. It validates workflow proposals before saving them.

LangGraph checkpoints hold execution state for recovery. Investor subgraphs may append observations and references in their own graph state, but that state does not replace application records. The official PostgreSQL checkpointer stores graph state separately from the application domain model.

## Consequences

Business rules can be tested without starting a graph, and a workflow retry cannot silently rewrite accepted history. Recovery needs an explicit way to connect graph observations to domain records. The domain model and its persistence rules remain the authority for that connection.
