import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/database.module';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [PrismaModule, UuidModule],
  controllers: [CategoryController],
  providers: [CategoryService, EncryptionService],
  exports: [CategoryService],
})
export class CategoryModule {}
