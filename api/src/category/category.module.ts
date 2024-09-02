import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/database.module';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from 'src/core/cache/cache.service';

@Module({
  imports: [PrismaModule, UuidModule, RedisModule],
  controllers: [CategoryController],
  providers: [CategoryService, EncryptionService, RedisService],
  exports: [CategoryService],
})
export class CategoryModule {}
