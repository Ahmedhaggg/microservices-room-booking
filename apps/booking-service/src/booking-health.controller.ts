import { Controller, Get } from '@nestjs/common';
import { BookingHealthService } from './booking-health.service';

@Controller()
export class BookingHealthController {
  constructor(private readonly bookingHealthService: BookingHealthService) {}

  @Get()
  getHello(): string {
    return this.bookingHealthService.getHello();
  }

  @Get('health/db')
  getDatabaseHealth(): Promise<{ service: string; database: string }> {
    return this.bookingHealthService.getDatabaseHealth();
  }
}
