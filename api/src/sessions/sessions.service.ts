import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { GetUserSessionDto } from './dto/getSession.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserSessions(uuid: string): Promise<any[]> {
    const sessions = await this.prismaService.session.findMany({
      where: { uuid },
      select: {
        uuid: true,
        ipAddress: true,
        userAgent: true,
        city: true,
        region: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        isActive: true,
      },
    });

    if (sessions.length === 0) {
      throw new NotFoundException('No sessions found for the provided UUID');
    }

    return sessions;
  }
}
