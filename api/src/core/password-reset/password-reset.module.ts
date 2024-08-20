import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from 'src/user/user.module';
@Module({
  imports: [MailModule],
  providers: [PasswordResetService],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
