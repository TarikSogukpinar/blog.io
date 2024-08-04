import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheck } from '@nestjs/terminus';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'health', version: '1' })
@ApiTags('Health')
@ApiBearerAuth()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  @HealthCheck()
  @ApiBody({ description: 'Health check' })
  @HttpCode(HttpStatus.OK)
  async check() {
    return await this.healthService.check();
  }
}
