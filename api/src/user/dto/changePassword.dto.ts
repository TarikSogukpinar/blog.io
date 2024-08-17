import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(2)
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
