import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/shared';
import * as schema from './db/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['apps/auth-service/.env'],
    }),
    DatabaseModule.register({
      serviceName: 'auth-service',
      schema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AuthServiceModule {}
