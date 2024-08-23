import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class DecryptPostResponseDto {
  @IsString()
  uuid: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  authorUuid: string;

  @IsString()
  categoryName: string;

  @IsBoolean()
  encrypted: boolean;

  @IsOptional()
  @IsString()
  tags?: string[];
}
