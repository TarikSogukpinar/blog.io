import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
