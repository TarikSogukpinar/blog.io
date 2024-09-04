import { IsDate, IsInt, IsString } from 'class-validator';

export class GetTagByIdDto {
  @IsInt()
  id: number;
}
