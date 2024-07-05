import { IsEmail, IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Email must be valid email' })
  @IsNotEmpty({ message: 'Email required' })
  @Length(2, 100, { message: 'Email too long' })
  email: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password required' })
  @Length(2, 100, { message: 'Password too long' })
  password: string;

  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name required' })
  @Length(2, 100, { message: 'Name too long' })
  name: string;



}