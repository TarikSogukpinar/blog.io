import { IsString } from 'class-validator';

export class LogoutResponseDto {
  @IsString()
  message: string;
}
