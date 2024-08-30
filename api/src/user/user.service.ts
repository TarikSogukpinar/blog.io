import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { GetUserUUIDResponseDto } from './dto/getUserUuidResponse.dto';
import {
  AccountIsAlreadyDeactivatedException,
  UserNotFoundException,
} from 'src/core/handler/exceptions/custom-expection';
import { UpdateUserAccountStatusResponseDto } from './dto/updateUserAccountStatusResponse.dto';
import { GetAllUsersResponseDto } from './dto/getAllUsersResponse.dto';
import { GetAllUsersPaginationDto } from './dto/getAllUsersPagination.dto';
import { RedisService } from 'src/core/cache/cache.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly uuidService: UuidService,
    private readonly redisService: RedisService,
  ) {}

  async getAllUsers(
    paginationParams: GetAllUsersPaginationDto,
  ): Promise<GetAllUsersResponseDto> {
    try {
      const { page, limit } = paginationParams;
      const offset = (page - 1) * limit;
      const cacheKey = `all_users_page_${page}_limit_${limit}`;

      const cachedUsers = await this.redisService.getValue(cacheKey);

      if (cachedUsers) return JSON.parse(cachedUsers);

      const [users, totalUsers] = await Promise.all([
        this.prismaService.user.findMany({
          skip: offset,
          take: limit,
          select: {
            uuid: true,
            email: true,
            role: true,
            name: true,
            bio: true,
            githubUrl: true,
            twitterUrl: true,
            linkedinUrl: true,
            accountType: true,
            isActiveAccount: true,
            ProfileImage: {
              select: {
                imageUrl: true,
              },
            },
          },
        }),
        this.prismaService.user.count(),
      ]);

      if (users.length === 0) throw new UserNotFoundException();

      const response = {
        users: users.map((user) => ({
          ...user,
          imageUrl: user.ProfileImage?.[0]?.imageUrl || null,
          ProfileImage: undefined,
        })),
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        totalUsers,
      };

      await this.redisService.setValue(
        cacheKey,
        JSON.stringify(response),
        3600,
      );

      return response;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: { resetToken: token },
    });

    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new Error('Token is invalid or has expired');
    }

    const hashedPassword = await this.hashingService.hashPassword(newPassword);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
  }

  async saveResetToken(
    userId: number,
    resetToken: string,
    resetTokenExpires: Date,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { resetToken, resetTokenExpires },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { resetToken: token },
    });
  }

  async clearResetToken(userId: number): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { resetToken: null, resetTokenExpires: null },
    });
  }

  async getUserByUuid(uuid: string): Promise<GetUserUUIDResponseDto> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException(ErrorCodes.InvalidUuid);
    }

    const user = await this.prismaService.user.findUnique({
      where: { uuid: uuid },
      select: {
        uuid: true,
        email: true,
        role: true,
        name: true,
        bio: true,
        githubUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
        accountType: true,
        isActiveAccount: true,
        ProfileImage: {
          select: {
            imageUrl: true,
          },
        },
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
      bio: user.bio,
      imageUrl: user.ProfileImage?.[0]?.imageUrl || null,
      accountType: user.accountType,
      isActiveAccount: user.isActiveAccount,
      githubUrl: user.githubUrl,
      twitterUrl: user.twitterUrl,
      linkedinUrl: user.linkedinUrl,
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
      throw new NotFoundException(ErrorCodes.UserNotFound);
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

  async updateUserAccountStatus(
    userUuid: string,
    isActive: boolean,
  ): Promise<UpdateUserAccountStatusResponseDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uuid: userUuid },
        select: {
          isActiveAccount: true,
        },
      });

      if (!user) throw new UserNotFoundException();

      if (user.isActiveAccount === isActive)
        throw new AccountIsAlreadyDeactivatedException();

      const result = await this.prismaService.user.update({
        where: { uuid: userUuid },
        data: { isActiveAccount: isActive },
      });

      return { isActiveAccount: result.isActiveAccount };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
