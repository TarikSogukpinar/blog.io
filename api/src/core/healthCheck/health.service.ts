import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import * as os from 'os';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class HealthCheckService extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isDbHealthy = await this.isDatabaseHealthy();
    const isCpuHealthy = await this.isCpuHealthy();
    const isMemoryHealthy = await this.isMemoryHealthy();

    const isHealthy = isDbHealthy && isCpuHealthy && isMemoryHealthy;
    const result = this.getStatus(key, isHealthy);
    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Health check failed', result);
  }

  async isDatabaseHealthy(): Promise<boolean> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      return false;
    }
  }

  async isCpuHealthy(): Promise<boolean> {
    const loadAverage = os.loadavg()[0]; // 1 dakikalık load average
    const numberOfCpus = os.cpus().length;
    return loadAverage / numberOfCpus < 1;
  }

  async isMemoryHealthy(): Promise<boolean> {
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const memoryUsage = (totalMemory - freeMemory) / totalMemory;
    return memoryUsage < 0.8;
  }
}
