import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from 'libs/shared';
import { rabbitMqQueues } from 'libs/common';
import { BookingHealthController } from './booking-health.controller';
import { BookingHealthService } from './booking-health.service';
import { BookingModule } from './modules/booking/booking.module';
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
    ClientsModule.registerAsync([
      {
        name: 'ROOMS_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
            queue: rabbitMqQueues.roomsService,
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
            queue: rabbitMqQueues.notificationService,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
    BookingModule,
  ],
  controllers: [BookingHealthController],
  providers: [BookingHealthService],
})
export class BookingServiceModule {}
