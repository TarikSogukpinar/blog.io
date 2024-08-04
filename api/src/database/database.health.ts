import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from './database.service';


@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Basit bir SELECT sorgusu ile veritabanı bağlantısını kontrol ediyoruz
      await this.prismaService.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      // Bağlantı hatası durumunda HealthCheckError fırlatıyoruz
      throw new HealthCheckError(
        'PrismaHealthIndicator failed',
        this.getStatus(key, false),
      );
    }
  }
}
