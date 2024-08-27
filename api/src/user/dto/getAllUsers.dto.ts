import { IsUUID, IsEmail, IsString, IsBoolean } from 'class-validator';

export class GetAllUsersResponseDto {
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

  @IsString()
  githubUrl: string;

  @IsString()
  twitterUrl: string;

  @IsString()
  linkedinUrl: string;

  @IsString()
  totalPages:string;

  @IsString()
  currentPage:string;

  @IsString()
  totalUsers:string;


}
