import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/shared';
import { RoomsServiceController } from './rooms-service.controller';
import { RoomsServiceService } from './rooms-service.service';
import * as schema from './db/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['apps/rooms-service/.env'],
    }),
    DatabaseModule.register({
      serviceName: 'rooms-service',
      schema,
    }),
  ],
  controllers: [RoomsServiceController],
  providers: [RoomsServiceService],
})
export class RoomsServiceModule {}
