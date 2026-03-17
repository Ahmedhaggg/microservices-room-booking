import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export interface DatabaseModuleOptions<TSchema extends Record<string, unknown>> {
  serviceName: string;
  schema: TSchema;
}

export interface DatabaseConnection<TSchema extends Record<string, unknown>> {
  pool: Pool;
  db: NodePgDatabase<TSchema>;
}

export interface DatabaseEnv {
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  DB_SSL?: string;
}

export interface DatabaseConfigReader {
  get(propertyPath: string): string | undefined;
}

export type DrizzleDatabase<TSchema extends Record<string, unknown>> =
  NodePgDatabase<TSchema>;
