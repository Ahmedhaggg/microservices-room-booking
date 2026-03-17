import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const authServiceMetadata = pgTable('auth_service_metadata', {
  id: serial('id').primaryKey(),
  serviceName: text('service_name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
