import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Session, User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { GetUserUUIDResponseDto } from './dto/getUserUuidResponse.dto';
import { GetUserSessionDto } from './dto/getSession.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private uuidService: UuidService,
  ) {}

  async getUserByUuid(id: string): Promise<GetUserUUIDResponseDto> {
    if (!(await this.uuidService.validateUuid(id))) {
      throw new BadRequestException(ErrorCodes.InvalidUuid);
    }

    const user = await this.prismaService.user.findUnique({
      where: { uuid: id },
      select: {
        uuid: true,
        email: true,
        role: true,
        name: true,
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorCodes.UserNotFound);
    }

    return {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });
    return user;
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(ErrorCodes.UserNotFound);
    }

    const isMatch = await this.hashingService.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await this.hashingService.hashPassword(
      changePasswordDto.newPassword,
    );
    return await this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async getUserSessions(uuid: string): Promise<GetUserSessionDto[]> {
    if (!this.uuidService.validateUuid(uuid)) {
      throw new BadRequestException(ErrorCodes.InvalidUuid);
    }

    const sessions = await this.prismaService.session.findMany({
      where: { uuid: uuid },
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

    return sessions.map((session) => ({
      uuid: session.uuid,
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
  }
}
