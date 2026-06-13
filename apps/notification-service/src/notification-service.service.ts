import {
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  type BookingConfirmedEvent,
  type BookingRejectedEvent,
  type UserRegisteredEvent,
} from 'libs/common';
import {
  checkDatabaseConnection,
  DRIZZLE_DB,
  type DrizzleDatabase,
} from 'libs/shared';
import * as schema from './db/schema';

@Injectable()
export class NotificationServiceService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DrizzleDatabase<typeof schema>,
  ) {}

  getHello(): string {
    return 'notification-service ready';
  }

  async getDatabaseHealth(): Promise<{ service: string; database: string }> {
    await checkDatabaseConnection(this.db);
    return {
      service: 'notification-service',
      database: 'up',
    };
  }

  async handleUserRegistered(payload: UserRegisteredEvent): Promise<void> {
    await this.db
      .insert(schema.notifications)
      .values({
        id: payload.userId,
        bookingId: payload.userId,
        userId: payload.userId,
        roomId: 'N/A',
        status: 'USER_REGISTERED',
        message: `User ${payload.displayName} (${payload.email}) registered successfully.`,
        sourceEventId: payload.userId,
        createdAt: new Date(payload.createdAt),
      })
      .onConflictDoNothing({
        target: schema.notifications.sourceEventId,
      });
  }

  async handleBookingConfirmed(payload: BookingConfirmedEvent): Promise<void> {
    await this.db
      .insert(schema.notifications)
      .values({
        id: payload.bookingId,
        bookingId: payload.bookingId,
        userId: payload.userId,
        roomId: payload.roomId,
        status: payload.status,
        message: `Booking ${payload.bookingId} confirmed for room ${payload.roomId}.`,
        sourceEventId: payload.bookingId,
        createdAt: new Date(),
      })
      .onConflictDoNothing({
        target: schema.notifications.sourceEventId,
      });
  }

  async handleBookingRejected(payload: BookingRejectedEvent): Promise<void> {
    await this.db
      .insert(schema.notifications)
      .values({
        id: payload.bookingId,
        bookingId: payload.bookingId,
        userId: payload.userId,
        roomId: payload.roomId,
        status: payload.status,
        message: `Booking ${payload.bookingId} rejected: ${payload.reason}.`,
        sourceEventId: payload.bookingId,
        createdAt: new Date(),
      })
      .onConflictDoNothing({
        target: schema.notifications.sourceEventId,
      });
  }
}
