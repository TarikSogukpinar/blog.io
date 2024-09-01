import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteCategoryResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
