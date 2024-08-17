import {
  IsUUID,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class GetUserSessionDto {
  @IsUUID()
  uuid: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsDateString()
  createdAt: string; // Date -> string

  @IsDateString()
  updatedAt: string; // Date -> string

  @IsDateString()
  expiresAt: string; // Date -> string

  @IsBoolean()
  isActive: boolean;
}