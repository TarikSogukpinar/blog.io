import { IsString, IsEmail, IsUUID } from 'class-validator';

export class RegisterResponseDto {
  @IsUUID()
  uuid: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
