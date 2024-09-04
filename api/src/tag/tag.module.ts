import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { PrismaService } from 'src/database/database.service';
import { RedisService } from 'src/core/cache/cache.service';
import { PrismaModule } from 'src/database/database.module';

@Module({
  imports: [PrismaModule],
  providers: [PrismaService, RedisService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
