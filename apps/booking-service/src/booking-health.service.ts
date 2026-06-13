import { Inject, Injectable } from '@nestjs/common';
import { checkDatabaseConnection, DRIZZLE_DB, type DrizzleDatabase } from 'libs/shared';
import * as schema from './db/schema';

@Injectable()
export class BookingHealthService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DrizzleDatabase<typeof schema>,
  ) {}

  getHello(): string {
    return 'booking-service ready';
  }

  async getDatabaseHealth(): Promise<{ service: string; database: string }> {
    await checkDatabaseConnection(this.db);

    return {
      service: 'booking-service',
      database: 'up',
    };
  }
}
