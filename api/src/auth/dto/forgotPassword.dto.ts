import { IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @Length(2, 100)
  email: string;
}
