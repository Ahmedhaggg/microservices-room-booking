import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/shared';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationEventController } from './notification-event.controller';
import { NotificationServiceService } from './notification-service.service';
import * as schema from './db/schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['apps/notification-service/.env'],
    }),
    DatabaseModule.register({
      serviceName: 'notification-service',
      schema,
    }),
  ],
  controllers: [NotificationServiceController, NotificationEventController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
