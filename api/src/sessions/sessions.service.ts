import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import * as requestIp from 'request-ip';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { timeout, catchError, retry } from 'rxjs/operators';
import { GetUserSessionResponseDto } from './dto/getUserSessionsResponse.dto';
import {
  FailedToLocationUserException,
  NoActiveSessionsFoundException,
  UserNotFoundException,
} from 'src/core/handler/exceptions/custom-expection';
import { RedisService } from 'src/core/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(
    userId: number,
    userUuid: string,
    token: string,
    req: Request,
  ): Promise<any> {
    try {
      const clientIp = requestIp.getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      const locationData = await this.getLocationData(clientIp);
      const expiresIn = 24 * 60 * 60 * 1000; // 24 hours
      const expiresAt = new Date(Date.now() + expiresIn);

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
          uuid: userUuid,
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

  async terminateSession(userUuid: string, token: string): Promise<any> {
    try {
      const session = await this.prismaService.session.findFirst({
        where: {
          uuid: userUuid,
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

      await this.prismaService.blacklistedToken.create({
        data: {
          token: session.token,
          expiresAt: session.expiresAt,
        },
      });

      await this.prismaService.session.delete({
        where: { id: session.id },
      });

      return terminatedSession;
    } catch (error) {
      console.error('Error terminating session:', error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getUserSessions(
    userUuid: string,
  ): Promise<GetUserSessionResponseDto[]> {
    const cacheKey = `user_sessions:${userUuid}`;

    const cachedSessions = await this.redisService.getValue(cacheKey);

    if (cachedSessions) {
      return JSON.parse(cachedSessions);
    }

    const user = await this.prismaService.user.findUnique({
      where: { uuid: userUuid },
    });

    if (!user) throw new UserNotFoundException();

    const sessions = await this.prismaService.session.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    if (sessions.length === 0) throw new NoActiveSessionsFoundException();

    const sessionDtos = sessions.map((session) => ({
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      city: session.city,
      region: session.region,
      country: session.country,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      isActive: session.isActive,
    }));

    await this.redisService.setValue(
      cacheKey,
      JSON.stringify(sessionDtos),
      3600,
    );

    return sessionDtos;
  }

  private async getLocationData(ipAddress: string): Promise<any> {
    try {
      const baseUrl = this.configService.get<string>('IP_API_URL');

      const response = await lastValueFrom(
        this.httpService.get(`${baseUrl}/${ipAddress}/json/`).pipe(
          timeout(5000),
          retry(2),
          catchError((error) => {
            console.error('Failed to fetch location data:', error.message);
            throw new FailedToLocationUserException();
          }),
        ),
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
