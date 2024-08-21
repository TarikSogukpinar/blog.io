import { IsString, IsNotEmpty, MaxLength, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePostDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(50, { message: 'Title is too long' })
  @MinLength(2, { message: 'Title is too short' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content is too short' })
  content: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

}
