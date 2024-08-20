import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  NotFoundException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/core/request/customRequest';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { GetUserByUuidDto } from './dto/getUserUuid.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/utils/upload/upload.service';
import { MailService } from 'src/core/mail/mail.service';
import { PasswordResetService } from 'src/core/password-reset/password-reset.service';

@Controller({ path: 'user', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
    private readonly mailService: MailService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: CustomRequest) {
    const userUuid = req.user?.uuid;

    if (!userUuid) {
      throw new NotFoundException(ErrorCodes.InvalidCredentials);
    }

    const user = await this.usersService.getUserByUuid(userUuid);

    if (!user) {
      throw new NotFoundException(ErrorCodes.UserNotFound);
    }

    return user;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param() getUserByUuidDto: GetUserByUuidDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException(ErrorCodes.InvalidCredentials);
    }

    const user = await this.usersService.getUserByUuid(getUserByUuidDto.id);

    if (!user) {
      throw new NotFoundException(ErrorCodes.UserNotFound);
    }

    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CustomRequest,
  ) {
    const userId = parseInt(id, 10);
    if (req.user?.id !== userId) {
      throw new UnauthorizedException('You can only update your own profile');
    }

    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: CustomRequest,
  ) {
    const userUuid = req.user?.uuid;

    if (!userUuid) {
      throw new UnauthorizedException('You can only change your own password');
    }

    return this.usersService.changePassword(userUuid, changePasswordDto);
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
      throw new Error('User UUID not found');
    }
    const imagePath = await this.uploadService.uploadProfileImage(
      file,
      userUuid,
    );

    await this.usersService.updateProfileImage(userUuid, imagePath);

    return { imageUrl: imagePath };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void> {
    await this.passwordResetService.sendPasswordResetLink(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    await this.usersService.resetPassword(token, newPassword);
  }
}
