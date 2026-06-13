import { bookings } from '../../../db/schema';

export type BookingEntity = typeof bookings.$inferSelect;
export type CreateBookingEntity = typeof bookings.$inferInsert;
