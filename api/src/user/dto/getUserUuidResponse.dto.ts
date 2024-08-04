import { IsUUID, IsEmail, IsString } from 'class-validator';

export class GetUserUUIDResponseDto {
  @IsUUID()
  uuid: string;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  role: string;
}
