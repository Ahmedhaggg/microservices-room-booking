import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_DB, type DrizzleDatabase } from 'libs/shared';
import * as schema from '../../../infrastructure/database/schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: DrizzleDatabase<typeof schema>,
  ) {}

  async createUser(user: typeof schema.users.$inferInsert) {
    const [insertedUser] = await this.db.insert(schema.users).values(user).returning();
    return insertedUser;
  }

  async findUserByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  }

  async findUserById(id: string) {
    return this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  }

  async updateUser(
    id: string,
    update: Partial<typeof schema.users.$inferInsert>,
  ): Promise<void> {
    await this.db
      .update(schema.users)
      .set(update)
      .where(eq(schema.users.id, id));
  }
}
