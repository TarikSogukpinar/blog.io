import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
