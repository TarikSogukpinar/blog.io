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

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly uuidService: UuidService,
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

  //refactor this method
  async changePassword(
    uuid: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { uuid },
      include: {
        PasswordHistory: {
          orderBy: { createdAt: 'desc' },
          take: 2,
        },
      },
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

    for (const history of user.PasswordHistory) {
      const isOldPassword = await this.hashingService.comparePassword(
        changePasswordDto.newPassword,
        history.password,
      );
      if (isOldPassword) {
        throw new BadRequestException(
          'New password cannot be the same as the last two passwords',
        );
      }
    }

    const hashedPassword = await this.hashingService.hashPassword(
      changePasswordDto.newPassword,
    );

    const updatedUser = await this.prismaService.user.update({
      where: { uuid },
      data: { password: hashedPassword },
    });

    await this.prismaService.passwordHistory.create({
      data: {
        userId: user.id,
        password: user.password,
      },
    });

    return updatedUser;
  }

  async updateProfileImage(userUuid: string, imagePath: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { uuid: userUuid },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.profileImage.upsert({
      where: {
        userId: user.id,
        uuid: userUuid,
      },
      create: {
        userId: user.id,
        uuid: userUuid,
        imageUrl: imagePath,
      },
      update: {
        imageUrl: imagePath,
      },
    });

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { image: imagePath },
    });
  }
}
