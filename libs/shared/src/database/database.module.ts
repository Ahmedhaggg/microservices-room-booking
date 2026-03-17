import {
  DynamicModule,
  Inject,
  Injectable,
  Module,
  OnApplicationShutdown,
  type Provider,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { Pool } from 'pg';
import {
  createDatabaseConnection,
  createDrizzleClientFromPool,
} from './database.client';
import { createDatabaseConfig, DatabaseConfigService } from './database.config';
import { DATABASE_CONFIG, DATABASE_POOL, DRIZZLE_DB } from './database.constants';
import type {
  DatabaseConfig,
  DatabaseModuleOptions,
  DrizzleDatabase,
} from './database.types';

@Injectable()
class DatabasePoolLifecycle implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

@Module({})
export class DatabaseModule {
  static register<TSchema extends Record<string, unknown>>(
    options: DatabaseModuleOptions<TSchema>,
  ): DynamicModule {
    const configProvider: Provider = {
      provide: DATABASE_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DatabaseConfig =>
        createDatabaseConfig(configService),
    };

    const poolProvider: Provider = {
      provide: DATABASE_POOL,
      inject: [DATABASE_CONFIG],
      useFactory: (config: DatabaseConfig): Pool =>
        createDatabaseConnection(config, options.schema).pool,
    };

    const databaseProvider: Provider = {
      provide: DRIZZLE_DB,
      inject: [DATABASE_POOL],
      useFactory: (pool: Pool): DrizzleDatabase<TSchema> =>
        createDrizzleClientFromPool(pool, options.schema),
    };

    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers: [
        DatabaseConfigService,
        configProvider,
        poolProvider,
        databaseProvider,
        DatabasePoolLifecycle,
      ],
      exports: [DATABASE_CONFIG, DATABASE_POOL, DRIZZLE_DB, DatabaseConfigService],
      global: false,
    };
  }
}
