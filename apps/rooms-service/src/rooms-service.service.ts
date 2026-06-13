import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { and, eq, gt, lt } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import {
  rabbitMqRoutingKeys,
  type BookingRequestedEvent,
  type RoomReservationConfirmedEvent,
  type RoomReservationRejectedEvent,
  type RoomReservationStatus,
} from 'libs/common';
import {
  checkDatabaseConnection,
  DRIZZLE_DB,
  type DrizzleDatabase,
} from 'libs/shared';
import * as schema from './db/schema';

export interface CreateRoomRequest {
  name: string;
}

function readRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new BadRequestException(`${field} is required.`);
  }

  return value.trim();
}

function readRequiredDate(value: string, field: string): Date {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new BadRequestException(`${field} must be a valid ISO date string.`);
  }

  return parsedDate;
}

@Injectable()
export class RoomsServiceService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DrizzleDatabase<typeof schema>,
    @Inject('BOOKING_SERVICE')
    private readonly bookingClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'rooms-service ready';
  }

  async getDatabaseHealth(): Promise<{ service: string; database: string }> {
    await checkDatabaseConnection(this.db);

    return {
      service: 'rooms-service',
      database: 'up',
    };
  }

  async createRoom(request: CreateRoomRequest) {
    const name = readRequiredString(request.name, 'name');
    const existingRoom = await this.db.query.rooms.findFirst({
      where: eq(schema.rooms.name, name),
    });

    if (existingRoom) {
      throw new ConflictException(`Room "${name}" already exists.`);
    }

    const room = {
      id: randomUUID(),
      name,
      createdAt: new Date(),
    };

    await this.db.insert(schema.rooms).values(room);

    return {
      id: room.id,
      name: room.name,
      createdAt: room.createdAt.toISOString(),
    };
  }

  async handleBookingRequested(payload: BookingRequestedEvent): Promise<void> {
    const existingDecision = await this.db.query.roomReservationDecisions.findFirst({
      where: eq(schema.roomReservationDecisions.bookingId, payload.bookingId),
    });

    if (existingDecision) {
      await this.publishDecision(existingDecision);
      return;
    }

    const startsAt = readRequiredDate(payload.startsAt, 'startsAt');
    const endsAt = readRequiredDate(payload.endsAt, 'endsAt');

    if (startsAt >= endsAt) {
      throw new BadRequestException('startsAt must be before endsAt.');
    }

    const room = await this.db.query.rooms.findFirst({
      where: eq(schema.rooms.id, payload.roomId),
    });

    let status: RoomReservationStatus = 'CONFIRMED';
    let rejectionReason: string | null = null;

    if (!room) {
      status = 'REJECTED';
      rejectionReason = 'ROOM_NOT_FOUND';
    } else {
      const conflictingReservation = await this.db.query.roomReservationDecisions.findFirst({
        where: and(
          eq(schema.roomReservationDecisions.roomId, payload.roomId),
          eq(schema.roomReservationDecisions.status, 'CONFIRMED'),
          lt(schema.roomReservationDecisions.startsAt, endsAt),
          gt(schema.roomReservationDecisions.endsAt, startsAt),
        ),
      });

      if (conflictingReservation) {
        status = 'REJECTED';
        rejectionReason = 'ROOM_NOT_AVAILABLE';
      }
    }

    const createdAt = new Date();
    const decision = {
      bookingId: payload.bookingId,
      userId: payload.userId,
      roomId: payload.roomId,
      startsAt,
      endsAt,
      status,
      rejectionReason,
      sourceEventId: payload.bookingId,
      publishedEventId: randomUUID(),
      createdAt,
    };

    await this.db.insert(schema.roomReservationDecisions).values(decision);
    await this.publishDecision(decision);
  }

  private async publishDecision(
    decision: typeof schema.roomReservationDecisions.$inferSelect,
  ): Promise<void> {
    if (decision.status === 'CONFIRMED') {
      const payload: RoomReservationConfirmedEvent = {
        bookingId: decision.bookingId,
        userId: decision.userId,
        roomId: decision.roomId,
        startsAt: decision.startsAt.toISOString(),
        endsAt: decision.endsAt.toISOString(),
        status: 'CONFIRMED',
      };

      this.bookingClient.emit(rabbitMqRoutingKeys.roomReservationConfirmed, payload);
      return;
    }

    const payload: RoomReservationRejectedEvent = {
      bookingId: decision.bookingId,
      userId: decision.userId,
      roomId: decision.roomId,
      startsAt: decision.startsAt.toISOString(),
      endsAt: decision.endsAt.toISOString(),
      status: 'REJECTED',
      reason: decision.rejectionReason ?? 'ROOM_NOT_AVAILABLE',
    };

    this.bookingClient.emit(rabbitMqRoutingKeys.roomReservationRejected, payload);
  }
}
