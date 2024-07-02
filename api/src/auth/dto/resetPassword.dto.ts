import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}
