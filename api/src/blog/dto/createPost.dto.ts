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
  IsDate,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(50, { message: 'Title is too long' })
  @MinLength(2, { message: 'Title is too short' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content is too short' })
  content: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  @IsOptional()
  @IsInt({ message: 'CategoryId must be an integer' })
  categoryId?: number;

  @IsOptional()
  @IsArray({ message: 'TagIds must be an array' })
  @ArrayMinSize(1, { message: 'TagIds must have at least one element' })
  tagIds?: number[];

  @IsOptional()
  @IsBoolean({ message: 'Encrypted must be a boolean' })
  encrypted?: boolean;

  @IsDate()
  @IsOptional()
  expireAt?: Date;
}
