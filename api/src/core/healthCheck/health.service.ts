import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from 'src/database/database.health';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealthService: PrismaHealthIndicator,
  ) {}

  @HealthCheck()
  async check() {
    return await this.health.check([
      async () => await this.prismaHealthService.isHealthy('database'),
      async () =>
        await this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
