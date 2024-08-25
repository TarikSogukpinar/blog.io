import { IsBoolean } from 'class-validator';

export class UpdateUserAccountStatusResponseDto {
  @IsBoolean()
  isActiveAccount: boolean;
}
