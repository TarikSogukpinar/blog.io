import { IsEmail, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  @Length(2, 100)
  email: string;
}
