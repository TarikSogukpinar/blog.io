import { IsString } from 'class-validator';

export class UpdateCategoryResponseDto {
  @IsString()
  name: string;
}
