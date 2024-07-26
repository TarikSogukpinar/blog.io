import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { sanitizeInput } from 'src/core/sanitizer/sanitizer';

export class CreatePostDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(50, { message: 'Title is too long' })
  @MinLength(2, { message: 'Title is too short' })
  @Transform(({ value }) => sanitizeInput(value))
  title: string;

  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content is too short' })
  @Transform(({ value }) => sanitizeInput(value))
  content: string;
}
