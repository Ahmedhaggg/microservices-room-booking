import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomsServiceService, type CreateRoomRequest } from './rooms-service.service';

@Controller()
export class RoomsServiceController {
  constructor(private readonly roomsServiceService: RoomsServiceService) {}

  @Get()
  getHello(): string {
    return this.roomsServiceService.getHello();
  }

  @Get('health/db')
  getDatabaseHealth(): Promise<{ service: string; database: string }> {
    return this.roomsServiceService.getDatabaseHealth();
  }

  @Post('rooms')
  createRoom(@Body() body: CreateRoomRequest) {
    return this.roomsServiceService.createRoom(body);
  }
}
