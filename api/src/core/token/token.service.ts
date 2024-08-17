import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../../database/database.service';
import { ErrorCodes } from '../handler/error/error-codes';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async verifyToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = await this.jwtService.verify(token, { secret });

      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException(ErrorCodes.InvalidToken);
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException(ErrorCodes.InvalidToken);
    }
  }

  async createPasswordResetToken(user: User) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const passwordResetExpiresIn = this.configService.get<string>(
      'PASSWORD_RESET_EXPIRES_IN',
    );
    return this.jwtService.sign(
      { email: user.email, id: user.id, type: 'passwordReset' },
      { secret, expiresIn: passwordResetExpiresIn },
    );
  }

  async createAccessToken(user: User) {
    const payload = {
      id: user.id,
      uuid: user.uuid,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  async createRefreshToken(user: User) {
    const payload = { email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async updateRefreshToken(user: User, token: string) {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { refreshToken: token },
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    let userEmail;
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      userEmail = decoded.email;
    } catch (error) {
      throw new UnauthorizedException(ErrorCodes.InvalidToken);
    }

    const user = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException(ErrorCodes.InvalidToken);
    }

    return this.createAccessToken(user);
  }

  async blacklistToken(token: string): Promise<void> {
    try {
      const decodedToken = await this.jwtService.decode(token);
      const expiresAt = new Date(decodedToken.exp * 1000);

      await this.prismaService.blacklistedToken.create({
        data: { token, expiresAt },
      });
    } catch (error) {
      console.error('Error in blacklistToken:', error);
      throw new UnauthorizedException(ErrorCodes.InvalidToken);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.prismaService.blacklistedToken.findUnique({
      where: { token },
    });

    return !!blacklisted;
  }
}
