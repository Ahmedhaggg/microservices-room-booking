import { Inject, Injectable } from '@nestjs/common';
import { checkDatabaseConnection, DRIZZLE_DB, type DrizzleDatabase } from 'libs/shared';
import * as schema from './infrastructure/database/schema';

@Injectable()
export class UserHealthService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DrizzleDatabase<typeof schema>,
  ) {}

  getHello(): string {
    return 'user-service ready';
  }

  async getDatabaseHealth(): Promise<{ service: string; database: string }> {
    await checkDatabaseConnection(this.db);

    return {
      service: 'user-service',
      database: 'up',
    };
  }
}
