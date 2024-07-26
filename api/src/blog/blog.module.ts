import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaModule } from 'src/database/database.module';
import { EncryptionService } from 'src/utils/encryption/encryption.service';

@Module({
  imports: [PrismaModule],
  controllers: [BlogController],
  providers: [BlogService, EncryptionService],
})
export class BlogModule {}
