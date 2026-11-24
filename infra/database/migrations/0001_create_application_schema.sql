-- Creates the runtime schema and grants schema usage to turing_app.

CREATE SCHEMA IF NOT EXISTS turing_app;

REVOKE ALL ON SCHEMA turing_app FROM PUBLIC;

GRANT USAGE ON SCHEMA turing_app TO turing_app;
