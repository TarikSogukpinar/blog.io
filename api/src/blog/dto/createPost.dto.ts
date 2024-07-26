import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsInt,
  IsArray,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';
import { sanitizeInput } from 'src/core/sanitizer/sanitizer';

export class CreatePostDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(50, { message: 'Title is too long' })
  @MinLength(2, { message: 'Title is too short' })
  @Transform(({ value }) => sanitizeInput(value))
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content is too short' })
  @Transform(({ value }) => sanitizeInput(value))
  content: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  @Transform(({ value }) => sanitizeInput(value))
  slug?: string;

  @IsOptional()
  @IsInt({ message: 'CategoryId must be an integer' })
  categoryId?: number;

  @IsOptional()
  @IsArray({ message: 'TagIds must be an array' })
  @ArrayMinSize(1, { message: 'TagIds must have at least one element' })
  @Transform(({ value }) => value.map(sanitizeInput))
  tagIds?: number[];

  @IsOptional()
  @IsBoolean({ message: 'Encrypted must be a boolean' })
  encrypted?: boolean;
}
