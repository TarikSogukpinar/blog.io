import { IsEmail, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @Length(2, 100)
  email: string;
}
