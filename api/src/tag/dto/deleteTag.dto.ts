import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DeleteTagDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
