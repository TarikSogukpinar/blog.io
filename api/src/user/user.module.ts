import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaModule } from 'src/database/database.module';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { UploadService } from 'src/utils/upload/upload.service';
import { ImageProcessingService } from 'src/utils/image/image-process.service';
import { MailService } from 'src/core/mail/mail.service';
import { PasswordResetService } from 'src/core/password-reset/password-reset.service';

@Module({
  imports: [PrismaModule, UuidModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashingService,
    UploadService,
    ImageProcessingService,
    MailService,
    PasswordResetService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
