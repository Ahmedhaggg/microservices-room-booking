export const ROOM_BOOKING_EXCHANGE = 'room-booking.events';

export const rabbitMqQueues = {
  bookingService: 'booking-service.events',
  roomsService: 'rooms-service.events',
  notificationService: 'notification-service.events',
} as const;

export const rabbitMqRoutingKeys = {
  userRegistered: 'user.registered',
  userUpdated: 'user.updated',
  bookingRequested: 'booking.requested',
  roomReservationConfirmed: 'room.reservation.confirmed',
  roomReservationRejected: 'room.reservation.rejected',
  bookingConfirmed: 'booking.confirmed',
  bookingRejected: 'booking.rejected',
} as const;

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';
export type RoomReservationStatus = 'CONFIRMED' | 'REJECTED';

export interface RabbitMqEventEnvelope<TPayload> {
  eventId: string;
  occurredAt: string;
  source: string;
  payload: TPayload;
}

export interface UserRegisteredEvent {
  userId: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface UserUpdatedEvent {
  userId: string;
  email: string;
  displayName: string;
  roles: string;
  updatedAt: string;
}

export interface BookingRequestedEvent {
  bookingId: string;
  userId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
}

export interface RoomReservationConfirmedEvent {
  bookingId: string;
  userId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  status: 'CONFIRMED';
}

export interface RoomReservationRejectedEvent {
  bookingId: string;
  userId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  status: 'REJECTED';
  reason: string;
}

export interface BookingConfirmedEvent {
  bookingId: string;
  userId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  status: 'CONFIRMED';
}

export interface BookingRejectedEvent {
  bookingId: string;
  userId: string;
  roomId: string;
  startsAt: string;
  endsAt: string;
  status: 'REJECTED';
  reason: string;
}
