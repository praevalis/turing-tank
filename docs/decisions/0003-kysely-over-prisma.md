# ADR 0003: Use Kysely for Typed Persistence Queries

## Context

This project relies on PostgreSQL features that are part of the system boundary. These include separate database roles, row-level security, explicit migrations, and isolated workflow checkpoint storage. The persistence layer needs typed application queries, but the database schema should remain the authority rather than an ORM model.

Prisma 8 uses TypeScript and JSON operation files for migrations rather than SQL migration files. That is a poor fit here. The migrations also create database roles and row-level security policies, and define PostgreSQL-specific constraints. Those statements need to be visible in the migration files and reviewed as SQL. Kysely adds types to application queries without replacing that SQL workflow.

## Decisions

This project uses Kysely with the PostgreSQL driver for application queries. Kysely provides query types without becoming the authority for the relational schema.

Database migrations, grants, row-level security policies, and workflow checkpoint setup remain explicit SQL owned by the migration process. Persistence repositories own Kysely and map database rows into application read models or domain inputs. The domain and application layers do not depend on Kysely or Prisma.

Prisma is not used for application persistence in this project.

## Consequences

The database remains the authority for PostgreSQL behavior, and the migration files show the SQL that changes it. Kysely adds compile-time query assistance without moving application queries away from SQL concepts.

The project must maintain database-facing TypeScript types, repository mappings, and checks that catch schema drift. Persistence code is more explicit than it would be with a full ORM, and common CRUD operations require deliberate repository functions rather than generated entity methods.
