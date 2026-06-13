import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDatabase } from 'libs/shared';
import * as schema from '../../../db/schema';

@Injectable()
export class BookingRepository {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DrizzleDatabase<typeof schema>,
  ) {}


  async createBooking(booking: typeof schema.bookings.$inferInsert): Promise<void> {
    await this.db.insert(schema.bookings).values(booking);
  }

  async findBookingById(id: string) {
    return this.db.query.bookings.findFirst({
      where: eq(schema.bookings.id, id),
    });
  }

  async updateBooking(
    id: string,
    update: Partial<typeof schema.bookings.$inferInsert>,
  ): Promise<void> {
    await this.db
      .update(schema.bookings)
      .set(update)
      .where(eq(schema.bookings.id, id));
  }
}
