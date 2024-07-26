import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: 'Email required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password required' })
  @MinLength(2, { message: 'Password must be at least 6 characters long' })
  password: string;
}
