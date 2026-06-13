import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserServiceModule } from './user-service.module';
import { runMigrations } from './infrastructure/database/migrate';
import { rabbitMqQueues } from 'libs/common';

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create(UserServiceModule);
  app.useGlobalPipes(new ZodValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: rabbitMqQueues.notificationService,
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  app.enableShutdownHooks();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
