import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Pool } from 'pg';
import type { StartedTestContainer } from 'testcontainers';
import { startPostgresTestContainer } from '../../../test/integration/postgres-test-container';
import { runMigrations } from '../src/db/migrate';
import { AuthServiceModule } from './../src/auth-service.module';

describe('AuthServiceController (e2e)', () => {
  let app: INestApplication;
  let pool: Pool;
  let container: StartedTestContainer;

  beforeAll(async () => {
    const context = await startPostgresTestContainer(
      'auth_db',
      'auth_user',
      'auth_pass',
    );
    container = context.container;
    Object.assign(process.env, context.env);
    await runMigrations(context.env);
    pool = new Pool({
      host: context.env.DB_HOST,
      port: Number(context.env.DB_PORT),
      user: context.env.DB_USER,
      password: context.env.DB_PASSWORD,
      database: context.env.DB_NAME,
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  afterAll(async () => {
    await pool?.end();
    await container?.stop();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('auth-service ready');

    await request(app.getHttpServer())
      .get('/health/db')
      .expect(200)
      .expect({
        service: 'auth-service',
        database: 'up',
      });

    const result = await pool.query(
      "select table_name from information_schema.tables where table_name = 'auth_service_metadata'",
    );

    expect(result.rowCount).toBe(1);
  });
});
