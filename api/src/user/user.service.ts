import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/database.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { HashingService } from 'src/utils/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private hashingService: HashingService,
  ) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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
      throw new NotFoundException('User not found');
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
    return this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async getUserSessions(userId: number) {
    return [];
  }
}
