import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { Pool, type PoolClient } from 'pg';

interface MigrationFile {
    filePath: string;
    name: string;
    version: string;
}

const migrationDirectory = resolve(process.cwd(), 'infra', 'database', 'migrations');
const migrationFilePattern = /^(\d{4})_([a-z0-9_]+)\.sql$/;
const migrationSchema = 'turing_meta';
const migrationTable = `${migrationSchema}.schema_migrations`;
const migrationLockName = 'turing_tank_schema_migrations';

function parseMigrationFile(fileName: string): MigrationFile {
    const match = migrationFilePattern.exec(fileName);
    const version = match?.[1];
    const name = match?.[2];

    if (version === undefined || name === undefined) {
        throw new Error(`Migration filename must use the NNNN_description.sql format: ${fileName}`);
    }

    return {
        filePath: resolve(migrationDirectory, fileName),
        name,
        version,
    };
}

async function readMigrationFiles(): Promise<MigrationFile[]> {
    const entries = await readdir(migrationDirectory, { withFileTypes: true });
    const migrations = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
        .map((entry) => parseMigrationFile(entry.name))
        .sort((left, right) => left.version.localeCompare(right.version));

    const versions = new Set<string>();
    for (const migration of migrations) {
        if (versions.has(migration.version)) {
            throw new Error(`Duplicate migration version: ${migration.version}`);
        }

        versions.add(migration.version);
    }

    return migrations;
}

async function ensureMigrationTable(client: PoolClient): Promise<void> {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${migrationSchema}`);
    await client.query(`
        CREATE TABLE IF NOT EXISTS ${migrationTable} (
            version text PRIMARY KEY,
            name text NOT NULL,
            applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
    await client.query(`REVOKE ALL ON TABLE ${migrationTable} FROM PUBLIC`);
}

async function readAppliedVersions(client: PoolClient): Promise<Set<string>> {
    const result = await client.query<{ version: string }>(`SELECT version FROM ${migrationTable}`);

    return new Set(result.rows.map((row) => row.version));
}

async function applyMigration(client: PoolClient, migration: MigrationFile): Promise<void> {
    const sql = await readFile(migration.filePath, 'utf8');

    await client.query('BEGIN');
    try {
        await client.query(sql);
        await client.query(`INSERT INTO ${migrationTable} (version, name) VALUES ($1, $2)`, [
            migration.version,
            migration.name,
        ]);
        await client.query('COMMIT');
    } catch (error: unknown) {
        await client.query('ROLLBACK');
        throw error;
    }
}

/**
 * Applies all pending SQL migrations to a PostgreSQL database.
 *
 * @param databaseUrl PostgreSQL connection URL for the migration role.
 * @returns A promise that resolves after all pending migrations are committed.
 */
export async function migrateDatabase(databaseUrl: string): Promise<void> {
    const pool = new Pool({
        connectionString: databaseUrl,
    });
    const client = await pool.connect();
    let lockAcquired = false;

    try {
        await client.query('SELECT pg_advisory_lock(hashtext($1))', [migrationLockName]);
        lockAcquired = true;

        await ensureMigrationTable(client);
        const appliedVersions = await readAppliedVersions(client);
        const migrations = await readMigrationFiles();

        for (const migration of migrations) {
            if (appliedVersions.has(migration.version)) {
                continue;
            }

            await applyMigration(client, migration);
            console.log(`Applied migration ${migration.version}_${migration.name}`);
        }
    } finally {
        if (lockAcquired) {
            await client.query('SELECT pg_advisory_unlock(hashtext($1))', [migrationLockName]);
        }

        client.release();
        await pool.end();
    }
}
