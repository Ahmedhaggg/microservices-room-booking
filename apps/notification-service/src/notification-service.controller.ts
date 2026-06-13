import { Controller, Get } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationServiceService.getHello();
  }

  @Get('health/db')
  getDatabaseHealth(): Promise<{ service: string; database: string }> {
    return this.notificationServiceService.getDatabaseHealth();
  }
}
