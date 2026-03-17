import { NestFactory } from '@nestjs/core';
import { RoomsServiceModule } from './rooms-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RoomsServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
