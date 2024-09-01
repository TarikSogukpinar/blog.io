import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryResponseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
