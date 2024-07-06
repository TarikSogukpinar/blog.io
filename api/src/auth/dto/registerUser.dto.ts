import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Email must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @Length(2, 100, { message: 'Email too long' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(2, 200, { message: 'Password too long' })
  password: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name too long' })
  name: string;
}
