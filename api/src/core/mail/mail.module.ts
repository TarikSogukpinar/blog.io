import { forwardRef, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersModule } from 'src/user/user.module';
import { PasswordResetModule } from '../password-reset/password-reset.module';

@Module({
  imports: [PasswordResetModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
