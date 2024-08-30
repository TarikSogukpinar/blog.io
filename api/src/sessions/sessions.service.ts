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

@Injectable()
export class SessionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async createSession(
    userId: number,
    userUuid: string,
    token: string,
    req: Request,
  ) {
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
      console.error('Error in createSession:', error.message, {
        userId,
        userUuid,
        token,
        ip: requestIp.getClientIp(req),
        userAgent: req.headers['user-agent'],
      });

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

  async getUserSessions(userUuid: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { uuid: userUuid },
    });

    if (!user) {
      throw new NotFoundException(`User with UUID ${userUuid} not found`);
    }

    const sessions = await this.prismaService.session.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    if (sessions.length === 0) {
      throw new NotFoundException(
        `No active sessions found for user with UUID ${userUuid}`,
      );
    }

    return sessions;
  }

  private async getLocationData(ipAddress: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`https://ipapi.co/${ipAddress}/json/`).pipe(
          timeout(5000),
          retry(2),
          catchError((error) => {
            console.error('Failed to fetch location data:', error.message);
            throw new InternalServerErrorException(
              'Failed to fetch location data',
            );
          }),
        ),
      );
      return {
        city: response.data.city,
        region: response.data.region,
        country: response.data.country_name,
      };
    } catch (error) {
      console.error(
        `Error fetching location data for IP ${ipAddress}:`,
        error.message,
        error.response?.data,
      );
      console.error('Error fetching location data:', error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
