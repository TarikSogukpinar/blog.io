import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { TokenService } from '../core/token/token.service';
import { ConfigService } from '@nestjs/config';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { User } from '@prisma/client';
import { LoginUserDto } from './dto/loginUser.dto';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { HashingService } from 'src/utils/hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async registerUserService(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    try {
      const existingUser = await this.findUserByEmailService(
        registerUserDto.email,
      );

      if (existingUser) {
        throw new ConflictException(ErrorCodes.UserAlreadyExists);
      }

      const hashedPassword = await this.hashingService.hashPassword(
        registerUserDto.password,
      );

      const user = await this.prismaService.user.create({
        data: {
          name: registerUserDto.name,
          email: registerUserDto.email,
          password: hashedPassword,
        },
      });

      return { id: user.id, email: user.email, role: user.role };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async loginUserService(
    loginUserDto: LoginUserDto,
  ): Promise<LoginResponseDto> {
    try {
      const user = await this.validateUserService(loginUserDto);
      const accessToken = await this.tokenService.createAccessToken(user);
      const refreshToken = await this.tokenService.createRefreshToken(user);
      await this.tokenService.updateRefreshToken(user, refreshToken);

      return {
        accessToken,
        refreshToken,
        email: user.email,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logoutUserService(userId: string, token: string): Promise<void> {
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      // await this.tokenService.blacklistToken(token);
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async refreshTokenService(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const accessToken =
        await this.tokenService.refreshAccessToken(refreshToken);

      return {
        accessToken,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  private async findUserByEmailService(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user) throw new ConflictException(ErrorCodes.UserAlreadyExists);
    return user;
  }

  private async validateUserService(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException(ErrorCodes.UserNotFound);

    const isPasswordValid = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new NotFoundException(ErrorCodes.InvalidCredentials);

    return user;
  }
}
