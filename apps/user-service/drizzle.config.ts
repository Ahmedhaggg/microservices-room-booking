import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './apps/user-service/src/infrastructure/database/schema.ts',
  out: './apps/user-service/src/infrastructure/database/migrations',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER ?? 'user_user',
    password: process.env.DB_PASSWORD ?? 'user_pass',
    database: process.env.DB_NAME ?? 'user_db',
    ssl: process.env.DB_SSL === 'true',
  },
});
