import { sql } from 'drizzle-orm';
import type { DrizzleDatabase } from './database.types';

export async function checkDatabaseConnection<TSchema extends Record<string, unknown>>(
  db: DrizzleDatabase<TSchema>,
): Promise<boolean> {
  await db.execute(sql`select 1`);
  return true;
}
