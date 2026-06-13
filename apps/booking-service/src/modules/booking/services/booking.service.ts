import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import {
  rabbitMqRoutingKeys,
  type BookingConfirmedEvent,
  type BookingRejectedEvent,
  type BookingRequestedEvent,
  type BookingStatus,
  type RoomReservationConfirmedEvent,
  type RoomReservationRejectedEvent,
} from 'libs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { BookingEntity } from '../entities/booking.entity';
import { CreateBookingDto, validateCreateBooking } from '../validation/booking.validation';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    @Inject('ROOMS_SERVICE')
    private readonly roomsClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async createBooking(request: CreateBookingDto) {
    const validated = validateCreateBooking(request);
    const userId = validated.userId;
    const roomId = validated.roomId;
    const startsAt = new Date(validated.startsAt);
    const endsAt = new Date(validated.endsAt);

    const createdAt = new Date();
    const booking: BookingEntity = {
      id: randomUUID(),
      userId,
      roomId,
      startsAt,
      endsAt,
      status: 'PENDING' as BookingStatus,
      rejectionReason: null,
      requestedEventId: randomUUID(),
      roomDecisionEventId: null,
      finalEventId: null,
      createdAt,
      updatedAt: createdAt,
    };

    await this.bookingRepository.createBooking(booking);

    const eventPayload: BookingRequestedEvent = {
      bookingId: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      startsAt: booking.startsAt.toISOString(),
      endsAt: booking.endsAt.toISOString(),
    };

    this.roomsClient.emit(rabbitMqRoutingKeys.bookingRequested, eventPayload);

    return this.toBookingResponse(booking);
  }

  async getBooking(id: string) {
    const booking = await this.bookingRepository.findBookingById(id);

    if (!booking) {
      throw new NotFoundException(`Booking "${id}" was not found.`);
    }

    return this.toBookingResponse(booking);
  }

  async handleRoomReservationConfirmed(
    data: { eventId: string; payload: RoomReservationConfirmedEvent },
  ): Promise<void> {
    const booking = await this.requireBooking(data.payload.bookingId);

    if (
      booking.finalEventId &&
      booking.roomDecisionEventId === data.eventId &&
      booking.status !== 'PENDING'
    ) {
      await this.publishFinalBookingEvent(booking);
      return;
    }

    if (booking.status !== 'PENDING') {
      return;
    }

    const updatedAt = new Date();
    const finalEventId = randomUUID();

    await this.bookingRepository.updateBooking(booking.id, {
      status: 'CONFIRMED',
      rejectionReason: null,
      roomDecisionEventId: data.eventId,
      finalEventId,
      updatedAt,
    });

    await this.publishFinalBookingEvent({
      ...booking,
      status: 'CONFIRMED',
      rejectionReason: null,
      roomDecisionEventId: data.eventId,
      finalEventId,
      updatedAt,
    });
  }

  async handleRoomReservationRejected(
    data: { eventId: string; payload: RoomReservationRejectedEvent },
  ): Promise<void> {
    const booking = await this.requireBooking(data.payload.bookingId);

    if (
      booking.finalEventId &&
      booking.roomDecisionEventId === data.eventId &&
      booking.status !== 'PENDING'
    ) {
      await this.publishFinalBookingEvent(booking);
      return;
    }

    if (booking.status !== 'PENDING') {
      return;
    }

    const updatedAt = new Date();
    const finalEventId = randomUUID();

    await this.bookingRepository.updateBooking(booking.id, {
      status: 'REJECTED',
      rejectionReason: data.payload.reason,
      roomDecisionEventId: data.eventId,
      finalEventId,
      updatedAt,
    });

    await this.publishFinalBookingEvent({
      ...booking,
      status: 'REJECTED',
      rejectionReason: data.payload.reason,
      roomDecisionEventId: data.eventId,
      finalEventId,
      updatedAt,
    });
  }

  private async requireBooking(bookingId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking "${bookingId}" was not found.`);
    }

    return booking;
  }

  private async publishFinalBookingEvent(
    booking: BookingEntity,
  ): Promise<void> {
    if (!booking.finalEventId) {
      return;
    }

    if (booking.status === 'CONFIRMED') {
      const payload: BookingConfirmedEvent = {
        bookingId: booking.id,
        userId: booking.userId,
        roomId: booking.roomId,
        startsAt: booking.startsAt.toISOString(),
        endsAt: booking.endsAt.toISOString(),
        status: 'CONFIRMED',
      };

      this.notificationClient.emit(rabbitMqRoutingKeys.bookingConfirmed, payload);
      return;
    }

    if (booking.status === 'REJECTED') {
      const payload: BookingRejectedEvent = {
        bookingId: booking.id,
        userId: booking.userId,
        roomId: booking.roomId,
        startsAt: booking.startsAt.toISOString(),
        endsAt: booking.endsAt.toISOString(),
        status: 'REJECTED',
        reason: booking.rejectionReason ?? 'ROOM_NOT_AVAILABLE',
      };

      this.notificationClient.emit(rabbitMqRoutingKeys.bookingRejected, payload);
    }
  }

  private toBookingResponse(booking: BookingEntity) {
    return {
      id: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      startsAt: booking.startsAt.toISOString(),
      endsAt: booking.endsAt.toISOString(),
      status: booking.status,
      rejectionReason: booking.rejectionReason,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }
}
