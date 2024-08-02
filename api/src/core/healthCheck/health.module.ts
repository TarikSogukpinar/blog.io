import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { HealthCheckService } from './health.service';
import { PrismaService } from 'src/database/database.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthCheckService, PrismaService],
})
export class HealthModule {}
