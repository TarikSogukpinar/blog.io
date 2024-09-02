import {
    IsUUID,
    IsString,
    IsBoolean,
    IsOptional,
    IsDateString,
  } from 'class-validator';
  
  export class GetUserSessionResponseDto {
  
    @IsString()
    ipAddress?: string;
  
    @IsString()
    userAgent?: string;
  
    @IsString()
    city?: string;
  

    @IsString()
    region?: string;
  
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