import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { TokenService } from '../core/token/token.service';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { User } from '@prisma/client';
import { LoginUserDto } from './dto/loginUser.dto';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { LogoutResponseDto } from './dto/logoutResponse.dto';
import * as requestIp from 'request-ip';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUserService(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterResponseDto> {
    try {
      const { name, email, password } = registerUserDto;

      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException(ErrorCodes.UserAlreadyExists);
      }

      const hashedPassword = await this.hashingService.hashPassword(password);

      const user = await this.prismaService.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          role: 'USER',
        },
      });

      return { uuid: user.uuid, email: user.email, role: user.role };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async loginUserService(
    loginUserDto: LoginUserDto,
    req: Request,
  ): Promise<LoginResponseDto> {
    try {
      const { email, password } = loginUserDto;

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) throw new NotFoundException(ErrorCodes.UserNotFound);

      const isPasswordValid = await this.hashingService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordValid)
        throw new NotFoundException(ErrorCodes.InvalidCredentials);

      const accessToken = await this.tokenService.createAccessToken(user);
      const refreshToken = await this.tokenService.createRefreshToken(user);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { accessToken: accessToken },
      });

      await this.createSession(user.id, accessToken, req);

      return {
        accessToken,
        refreshToken,
        email: user.email,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async logoutUserService(
    userId: number,
    token: string,
  ): Promise<LogoutResponseDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(ErrorCodes.UserNotFound);
      }

      await this.prismaService.user.update({
        where: { id: userId },
        data: { accessToken: null, refreshToken: null },
      });

      await this.tokenService.blacklistToken(token);

      return { message: 'Logout successful' };
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
      return { accessToken };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async validateOAuthLoginEmail(
    email: string,
    provider: string,
  ): Promise<User> {
    let user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email,
          password: '',
          role: 'USER',
        },
      });
    }

    return user;
  }

  async validateOAuthLogin(profile: {
    email: string;
    provider: string;
  }): Promise<string> {
    const { email, provider } = profile;

    if (!email) {
      throw new Error('Email not found');
    }

    const user = await this.validateOAuthLoginEmail(email, provider);

    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async createSession(userId: number, token: string, req: Request) {
    try {
      const clientIp = requestIp.getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      const createSession = await this.prismaService.session.create({
        data: {
          userId,
          token,
          ipAddress: clientIp,
          userAgent,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat geçerli
          isActive: true,
        },
      });
      return createSession;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async terminateSession(userId: number, token: string) {
    try {
      const terminateSession = await this.prismaService.session.updateMany({
        where: { userId, token },
        data: { isActive: false },
      });
      return terminateSession;
    } catch (error) {
      console.error('Error terminating session:', error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getUserSessions(userId: number) {
    try {
      const sessions = await this.prismaService.session.findMany({
        where: { userId, isActive: true },
        select: {
          id: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          expiresAt: true,
        },
      });
      return sessions;
    } catch (error) {
      console.error('Error terminating session:', error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
