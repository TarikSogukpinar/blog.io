import { Type } from 'class-transformer';
import {
  IsUUID,
  IsEmail,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';

export class GetAllUsersUserDto {
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
  imageUrl: string | null;

  @IsString()
  accountType: string;

  @IsBoolean()
  isActiveAccount: boolean;

  @IsString()
  githubUrl: string;

  @IsString()
  twitterUrl: string;

  @IsString()
  linkedinUrl: string;
}

export class GetAllUsersResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetAllUsersUserDto)
  users: GetAllUsersUserDto[];

  @IsNumber()
  totalPages: number;

  @IsNumber()
  currentPage: number;

  @IsNumber()
  totalUsers: number;
}
