import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const notificationServiceMetadata = pgTable('notification_service_metadata', {
  id: serial('id').primaryKey(),
  serviceName: text('service_name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull(),
  userId: text('user_id').notNull(),
  roomId: text('room_id').notNull(),
  status: text('status').notNull(),
  message: text('message').notNull(),
  sourceEventId: text('source_event_id').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
