import { IsString, IsUUID } from 'class-validator';

export class GetUserByUuidDto {
  @IsUUID()
  @IsString()
  id: string;
}
