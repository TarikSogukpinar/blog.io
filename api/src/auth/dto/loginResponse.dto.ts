import { IsEmail, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsEmail()
  email: string;
}
