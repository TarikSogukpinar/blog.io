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
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
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

      const locationData = await this.getLocationData(clientIp);
      console.log('Location data:', locationData);
      const expiresIn = 24 * 60 * 60 * 1000; // 24 hours
      const expiresAt = new Date(Date.now() + expiresIn);

      // Find existing session and update it
      const existingSession = await this.prismaService.session.findFirst({
        where: { userId, isActive: true },
      });

      if (existingSession) {
        return await this.prismaService.session.update({
          where: { id: existingSession.id },
          data: {
            token,
            ipAddress: clientIp,
            userAgent,
            city: locationData?.city,
            region: locationData?.region,
            country: locationData?.country,
            expiresAt,
          },
        });
      }

      const createSession = await this.prismaService.session.create({
        data: {
          userId,
          token,
          ipAddress: clientIp,
          userAgent,
          city: locationData?.city,
          region: locationData?.region,
          country: locationData?.country,
          expiresAt,
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
      const session = await this.prismaService.session.findFirst({
        where: {
          userId,
          token,
          isActive: true,
        },
      });

      if (!session) {
        throw new NotFoundException(ErrorCodes.InvalidSessions);
      }

      const terminatedSession = await this.prismaService.session.update({
        where: { id: session.id },
        data: { isActive: false },
      });

      return terminatedSession;
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

  private async getLocationData(ipAddress: string): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.get(
        `https://ipapi.co/${ipAddress}/json/`,
      );
      return {
        city: response.data.city,
        region: response.data.region,
        country: response.data.country_name,
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
