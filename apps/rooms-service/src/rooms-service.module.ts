import { Module } from '@nestjs/common';
import { RoomsServiceController } from './rooms-service.controller';
import { RoomsServiceService } from './rooms-service.service';

@Module({
  imports: [],
  controllers: [RoomsServiceController],
  providers: [RoomsServiceService],
})
export class RoomsServiceModule {}
