import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const roomsServiceMetadata = pgTable('rooms_service_metadata', {
  id: serial('id').primaryKey(),
  serviceName: text('service_name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const rooms = pgTable('rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const roomReservationDecisions = pgTable('room_reservation_decisions', {
  bookingId: text('booking_id').primaryKey(),
  userId: text('user_id').notNull(),
  roomId: text('room_id').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  status: text('status').notNull(),
  rejectionReason: text('rejection_reason'),
  sourceEventId: text('source_event_id').notNull().unique(),
  publishedEventId: text('published_event_id').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
