import { pgTable, serial, text, timestamp, pgEnum, uuid } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['CUSTOMER', 'EMPLOYEE', 'MANAGER']);

export const userServiceMetadata = pgTable('user_service_metadata', {
  id: serial('id').primaryKey(),
  serviceName: text('service_name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  password: text('password').notNull(),
  roles: roleEnum('roles').notNull().default('CUSTOMER'),
  registeredEventId: uuid('registered_event_id').defaultRandom().notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
