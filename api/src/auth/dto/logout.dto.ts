import { IsNumber, IsString } from 'class-validator';

export class LogoutDto {
  @IsNumber()
  userId: number;
}

export class BlackListTokenLogoutDto {
  @IsString()
  token: string;
}
