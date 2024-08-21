import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  async sendPasswordResetLink(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
    const resetUrl = `http://localhost:5000/api/v1/user/reset-password?token=${resetToken}`;

    await this.usersService.saveResetToken(
      user.id,
      resetToken,
      resetTokenExpires,
    );
    await this.mailService.sendMail(
      email,
      'Password Reset Request',
      `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
    );
  }
}
