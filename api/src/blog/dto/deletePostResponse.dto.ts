import { IsString } from 'class-validator';

export class DeletePostResponseDto {
  @IsString({ message: 'Title must be a string' })
  postUuid: string;

  @IsString({ message: 'Content must be a string' })
  userUuid: string;
}
