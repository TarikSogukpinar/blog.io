import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  @Length(2, 50)
  @IsNotEmpty({ message: 'Email required' })
  email: string;

  @IsEmail({}, { message: 'Email must be a valid email' })
  @Length(2, 100)
  @IsNotEmpty({ message: 'Password required' })
  password: string;
}
