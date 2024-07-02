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

  @IsOptional()
  @IsString({ message: 'Server Name must be string' })
  @Length(2, 100, { message: 'Server Name to long' })
  serverName: string;

  @IsOptional()
  @IsString({ message: 'Server Description must be string' })
  @Length(2, 100, { message: 'Server Description to long' })
  serverDescription: string;


}