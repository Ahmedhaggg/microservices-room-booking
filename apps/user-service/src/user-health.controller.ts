import { Controller, Get } from '@nestjs/common';
import { UserHealthService } from './user-health.service';

@Controller()
export class UserHealthController {
  constructor(private readonly userHealthService: UserHealthService) {}

  @Get()
  getHello(): string {
    return this.userHealthService.getHello();
  }

  @Get('health/db')
  getDatabaseHealth(): Promise<{ service: string; database: string }> {
    return this.userHealthService.getDatabaseHealth();
  }
}
