import { setTimeout as delay } from 'node:timers/promises';
import { Pool } from 'pg';
import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers';

export interface PostgresTestContext {
  container: StartedTestContainer;
  env: {
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
  };
}

export async function startPostgresTestContainer(
  databaseName: string,
  username: string,
  password: string,
): Promise<PostgresTestContext> {
  const container = await new GenericContainer('postgres:16-alpine')
    .withEnvironment({
      POSTGRES_DB: databaseName,
      POSTGRES_USER: username,
      POSTGRES_PASSWORD: password,
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
    .start();

  const env = {
    DB_HOST: container.getHost(),
    DB_PORT: container.getMappedPort(5432).toString(),
    DB_USER: username,
    DB_PASSWORD: password,
    DB_NAME: databaseName,
  };

  await waitForPostgres(env);

  return {
    container,
    env,
  };
}

async function waitForPostgres(
  env: PostgresTestContext['env'],
  maxAttempts = 20,
): Promise<void> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const pool = new Pool({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    });

    try {
      await pool.query('select 1');
      await pool.end();
      return;
    } catch {
      await pool.end().catch(() => undefined);
      await delay(1000);
    }
  }

  throw new Error('PostgreSQL test container did not become ready in time.');
}
