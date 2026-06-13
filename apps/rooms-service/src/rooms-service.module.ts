import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from 'libs/shared';
import { rabbitMqQueues } from 'libs/common';
import { RoomsServiceController } from './rooms-service.controller';
import { RoomsEventController } from './rooms-event.controller';
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
    ClientsModule.registerAsync([
      {
        name: 'BOOKING_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
            queue: rabbitMqQueues.bookingService,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [RoomsServiceController, RoomsEventController],
  providers: [RoomsServiceService],
})
export class RoomsServiceModule {}
