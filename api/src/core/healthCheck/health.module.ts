import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { PrismaService } from 'src/database/database.service';
import { HealthService } from './health.service';
import { PrismaHealthIndicator } from 'src/database/database.health';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService, PrismaService, PrismaHealthIndicator],
})
export class HealthModule {}
