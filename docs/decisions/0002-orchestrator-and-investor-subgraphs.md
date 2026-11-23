# ADR 0002: Coordinate Reusable Investor Subgraphs From a Session Graph

## Context

The rehearsal has three investors with different theses and evidence standards. They need shared factual findings, but they do not always work in the same order. Investigation benefits from parallel work, while questioning and negotiation need an orchestrator that can react to the session.

Copying a complete workflow for each investor would make changes harder to review. It would also blur the difference between behavior shared by all investors and policy that belongs to one investor.

## Decisions

The session has an orchestration graph that coordinates the rehearsal. A reusable investor graph handles the workflow for one investor and receives a concrete implementation of the investor contract.

The orchestration graph can run investor subgraphs in parallel or in sequence. Each subgraph receives narrow typed inputs and returns typed proposals. It can append to its own nested graph state, but it cannot write directly to application domain state or call another investor.

## Consequences

The investors share a workflow shape while keeping their own theses, thresholds, and interaction styles. The orchestration graph must merge their proposals and coordinate shared evidence. Investor execution state remains separate from domain state and needs its own checkpoint and recovery handling.
