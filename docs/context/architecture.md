# Turing Tank Architecture

## Purpose

This document describes the boundaries that keep Turing Tank understandable and testable. It explains who owns a decision, how the web application reaches the session workflow, and how workflow execution relates to durable application data.

It does not define a source tree, a coding style, or an exact database schema. Domain entities, table names, enums, and relationships belong to the domain model and persistence design.

## Overall Shape

Turing Tank is a Next.js application with a clear server boundary. The browser-facing code handles the interface, browser sessions, HTTP requests, and progress streams. Its server routes are a thin backend-for-frontend layer that translates requests and responses. They do not decide business rules or investor behavior. The server-side application runs on Node.js and handles authentication, application use cases, domain rules, workflow coordination, tool execution, persistence, and recovery. These are logical boundaries inside one application, not a demand for separate deployments or repositories.

The application must run in a hosted Next.js deployment or a containerized Node.js deployment without changing its core behavior. It must not depend on provider-specific APIs for the parts that matter to the product.

## Web Requests and Application Work

The browser uses REST-style commands and queries. A live session also has a stream for progress and investor responses. The stream is only a delivery channel. It does not decide whether the server committed a change. The application records enough execution status for the browser to reconnect after a dropped connection. A client can ask for that status and continue from the durable record instead of treating the original stream as the only copy of the work.

Route handlers translate transport data into application calls. They do not perform deal arithmetic, choose investor positions, accept evidence, enforce session limits, or write persistence records directly. Those responsibilities stay behind the server boundary and can be tested without an HTTP request.

## Application State and Domain Rules

The application owns the accepted facts and decisions that make up a session. It also owns the rules that must hold when a model response, tool call, stream, or provider fails. This includes offer validity, financial arithmetic, session limits, authorization-sensitive changes, negotiation rules, and concurrency checks.

LangGraph checkpoints and nested investor graph state serve a different purpose. They describe work being executed and support recovery, but they are not the source of business truth. The application validates a workflow result before accepting it and stores meaningful changes at clear boundaries.

The persistence model follows the domain model. Graph checkpoints can refer to domain records and contain append-only observations, but a checkpoint does not define the application's entities or relationships.

## Orchestration and Investor Workflows

LangGraph.js runs as a library inside the Node.js server. It provides the graph runtime, state handling, and composition features used by the rehearsal workflow. It does not own the product domain or the investor implementations. The session orchestration graph coordinates the rehearsal by selecting the next phase, starting independent work in parallel, gathering results, and choosing the next workflow step. Investigation can invoke all three investors together, while questioning and negotiation can invoke them in an order that reflects session context and investor confidence.

Each investor runs through a reusable graph template. The template receives one concrete implementation of the investor contract, so the workflow shape is shared while the thesis and behavior remain distinct. An investor implementation can use LangGraph features inside its own workflow when those features help it reason or use tools.

Each investor has an independent module that owns its prompts, policy, evidence standards, interaction style, and tools that only that investor uses. A tool shared by multiple investors belongs in a neutral capability module instead. This keeps an investor's reasoning resources together without duplicating genuinely shared capabilities.

Investor objects do not keep mutable session state in their instances. The workflow passes them the context they need and receives a typed proposal. An investor owns its policy and reasoning resources, but it does not own the session's accepted facts or the overall sequence of the rehearsal.

An investor subgraph can write to its own nested graph state and append execution observations. It cannot write directly to application domain state, change another investor's state, or call another investor. The orchestration graph passes proposals, evidence references, and requested actions to the application layer, which validates what becomes durable application state.

## Models, Tools, and Evidence

Investor implementations use an application-owned model access interface. Provider adapters implement that interface, keeping provider SDKs and credentials out of investor policies. The interface makes structured output, tool calling, streaming, usage, and capability differences explicit. The application records which provider and model produced each call. It may change providers internally when recovery requires it, provided the change does not alter the investor identity, accepted session state, or deterministic deal rules.

Investor modules and neutral capability modules define the tools they own. A neutral tool runtime executes both kinds of tools through typed contracts. It checks permissions, inputs, research scope, time limits, retries, and budget, while tool results return with source information.

The runtime boundary does not make the application the owner of every tool. It supplies the cross-cutting controls that protect the session and the founder's data. Tool-specific behavior, prompts, schemas, and provider integrations remain with the module that owns the tool.

An evidence service decides which results become shared session evidence and records the sources connected to those findings. Investors can interpret the same evidence differently, but they do not receive different versions of the factual record. Financial calculations, offer checks, session limits, and state transitions remain application or domain services that an agent cannot bypass by choosing a tool.

## PostgreSQL and Workflow Checkpoints

PostgreSQL stores application data, session history, evidence, reports, and the records required by the domain model. The `pgvector` extension can support semantic evidence retrieval when that search improves the experience. An embedding remains linked to its source record and does not replace the fact or the relational rule it represents. LangGraph uses the official PostgreSQL checkpointer for execution state. Checkpoint data stays separate from the application domain model. A custom checkpointer would need to solve a concrete gap before replacing the official one.

The application persists accepted evidence and domain changes at meaningful boundaries. It does not wait for an entire graph invocation to finish before saving everything. A recovered workflow can therefore refer back to durable application records without treating partial graph work as accepted business truth.

## Recovery and Concurrent Work

A graph can resume after a failure or a disconnected stream. The end of a stream does not decide whether a domain change was committed. The application checks the workflow result during a short commit step after model or research work returns.

State-changing commands use idempotency keys. Domain commits use optimistic concurrency against the relevant application revision. When a proposal was built from stale state, the application rejects it or recomputes it from the latest accepted state.

The system does not hold a database lock while waiting for a model or research provider. A long-running workflow and a short durable commit are separate concerns.
