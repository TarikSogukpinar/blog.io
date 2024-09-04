import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
