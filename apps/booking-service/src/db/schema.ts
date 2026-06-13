import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const bookingServiceMetadata = pgTable('booking_service_metadata', {
  id: serial('id').primaryKey(),
  serviceName: text('service_name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});


export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  roomId: text('room_id').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  status: text('status').notNull(),
  rejectionReason: text('rejection_reason'),
  requestedEventId: text('requested_event_id').notNull().unique(),
  roomDecisionEventId: text('room_decision_event_id'),
  finalEventId: text('final_event_id').unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
