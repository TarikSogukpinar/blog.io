import { IsString } from 'class-validator';

export class CreatePostResponseDto {
  @IsString()
  uuid: string;

  @IsString()
  title: string;

  @IsString()
  slug: string;
}