import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './apps/notification-service/src/db/schema.ts',
  out: './apps/notification-service/src/db/migrations',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER ?? 'notification_user',
    password: process.env.DB_PASSWORD ?? 'notification_pass',
    database: process.env.DB_NAME ?? 'notification_db',
    ssl: process.env.DB_SSL === 'true',
  },
});
