import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckService as CustomHealthCheckService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private customHealthCheckService: CustomHealthCheckService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Health check' })
  @ApiTags('Health')
  @ApiResponse({ status: 200, description: 'Health Check Ok!' })
  @HealthCheck()
  async check() {
    return await this.health.check([
      async () => await this.customHealthCheckService.isHealthy('database'),
      async () => await this.customHealthCheckService.isHealthy('cpu'),
      async () => await this.customHealthCheckService.isHealthy('memory'),
    ]);
  }
}
