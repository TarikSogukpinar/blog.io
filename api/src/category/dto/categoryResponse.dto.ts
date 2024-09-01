import { IsNumber, IsString } from 'class-validator';

export class CategoryResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
