import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaModule } from 'src/database/database.module';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import { UuidModule } from 'src/utils/uuid/uuid.module';

@Module({
  imports: [PrismaModule, UuidModule],
  controllers: [BlogController],
  providers: [BlogService, EncryptionService],
  exports: [BlogService],
})
export class BlogModule {}
