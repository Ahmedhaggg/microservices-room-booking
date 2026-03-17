import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './apps/rooms-service/src/db/schema.ts',
  out: './apps/rooms-service/src/db/migrations',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    user: process.env.DB_USER ?? 'rooms_user',
    password: process.env.DB_PASSWORD ?? 'rooms_pass',
    database: process.env.DB_NAME ?? 'rooms_db',
    ssl: process.env.DB_SSL === 'true',
  },
});
