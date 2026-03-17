import type { DatabaseConfig, DatabaseConnection } from './database.types';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export function createDatabaseConnection<TSchema extends Record<string, unknown>>(
  config: DatabaseConfig,
  schema: TSchema,
): DatabaseConnection<TSchema> {
  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
  });

  const db = drizzle(pool, { schema });

  return { pool, db };
}

export function createDrizzleClientFromPool<TSchema extends Record<string, unknown>>(
  pool: Pool,
  schema: TSchema,
) {
  return drizzle(pool, { schema });
}

export function createDrizzleClient<TSchema extends Record<string, unknown>>(
  config: DatabaseConfig,
  schema: TSchema,
) {
  return createDatabaseConnection(config, schema).db;
}
