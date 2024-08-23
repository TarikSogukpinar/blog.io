import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostResponseDto {
  @IsString({ message: 'Post UUID must be a string' })
  uuid: string;

  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @IsString({ message: 'Content must be a string' })
  content?: string;
}
