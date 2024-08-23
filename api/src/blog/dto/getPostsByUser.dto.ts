import { IsBoolean, IsDate, IsString } from 'class-validator';

export class GetPostByUserResponseDto {
  @IsString()
  uuid: string;

  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  published: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
