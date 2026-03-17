import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/shared';
import { BookingServiceController } from './booking-service.controller';
import { BookingServiceService } from './booking-service.service';
import * as schema from './db/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['apps/booking-service/.env'],
    }),
    DatabaseModule.register({
      serviceName: 'booking-service',
      schema,
    }),
  ],
  controllers: [BookingServiceController],
  providers: [BookingServiceService],
})
export class BookingServiceModule {}
