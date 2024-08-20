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
import { GetUserSessionDto } from './dto/getSession.dto';

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
