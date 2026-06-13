import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from 'libs/shared';
import { rabbitMqQueues } from 'libs/common';
import { UserHealthController } from './user-health.controller';
import { UserHealthService } from './user-health.service';
import { UserModule } from './modules/user/user.module';
import * as schema from './infrastructure/database/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['apps/user-service/.env'],
    }),
    DatabaseModule.register({
      serviceName: 'user-service',
      schema,
    }),
    ClientsModule.registerAsync([
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
    UserModule,
  ],
  controllers: [UserHealthController],
  providers: [UserHealthService],
})
export class UserServiceModule {}
