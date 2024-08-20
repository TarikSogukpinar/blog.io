import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const mailgunAuth = {
      auth: {
        api_key: this.configService.get<string>('MAILGUN_API_KEY'),
        domain: this.configService.get<string>('MAILGUN_DOMAIN'),
      },
    };

    this.transporter = nodemailer.createTransport(mg(mailgunAuth));
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('MAILGUN_FROM_EMAIL'),
      to,
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
