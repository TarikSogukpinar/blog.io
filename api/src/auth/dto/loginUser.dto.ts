import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {

  

  @IsString()
  @Length(2, 50)
  @IsNotEmpty({ message: 'Email required' })
  email: string;

  @IsString()
  @Length(2, 100)
  @IsNotEmpty({ message: 'Password required' })
  password: string;
}
