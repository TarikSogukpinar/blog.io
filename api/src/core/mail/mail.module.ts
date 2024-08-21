import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { PasswordResetModule } from '../password-reset/password-reset.module';

@Module({
  imports: [PasswordResetModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
