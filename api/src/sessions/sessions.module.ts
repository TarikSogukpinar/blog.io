import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { PrismaService } from 'src/database/database.service'; // Eğer Prisma kullanıyorsanız
import { PrismaModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from 'src/core/cache/cache.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 100,
    }),
  ],
  providers: [SessionsService, PrismaService, RedisService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
