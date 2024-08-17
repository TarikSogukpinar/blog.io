import { IsUUID, IsEmail, IsString, IsNumber } from 'class-validator';

export class GetCurrentUserResponseDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
