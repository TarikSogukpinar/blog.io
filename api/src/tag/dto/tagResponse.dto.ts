import { IsDate, IsInt, IsString } from 'class-validator';

export class TagResponseDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
