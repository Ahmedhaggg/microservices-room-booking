import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { resolve } from 'node:path';
import { Pool } from 'pg';
import { readDatabaseConfig, type DatabaseEnv } from 'libs/shared';
import * as schema from './schema';

export async function runMigrations(env: DatabaseEnv = process.env): Promise<void> {
  const config = readDatabaseConfig(env);
  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const db = drizzle(pool, { schema });

    await migrate(db, {
      migrationsFolder: resolve(process.cwd(), 'apps/auth-service/src/db/migrations'),
    });
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  void runMigrations();
}
