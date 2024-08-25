import { IsUUID, IsEmail, IsString, IsBoolean } from 'class-validator';

export class GetUserUUIDResponseDto {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  bio: string;

  @IsString()
  imageUrl: string;

  @IsString()
  accountType: string;

  @IsBoolean()
  isActiveAccount: boolean;
}
