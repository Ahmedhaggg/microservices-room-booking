import { Controller, Get } from '@nestjs/common';
import { RoomsServiceService } from './rooms-service.service';

@Controller()
export class RoomsServiceController {
  constructor(private readonly roomsServiceService: RoomsServiceService) {}

  @Get()
  getHello(): string {
    return this.roomsServiceService.getHello();
  }
}
