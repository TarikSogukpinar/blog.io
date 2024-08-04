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
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/core/request/customRequest';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new ValidationPipe())
  async getUserById(@Param('id') id: string, @Req() req: CustomRequest) {
    const userId = req.user?.id;
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @UsePipes(new ValidationPipe())
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
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: CustomRequest,
  ) {
    const userId = parseInt(id, 10);
    if (req.user?.id !== userId) {
      throw new UnauthorizedException('You can only change your own password');
    }

    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Get(':id/sessions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user sessions' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  async getUserSessions(@Param('id') id: string, @Req() req: CustomRequest) {
    const userId = parseInt(id, 10);
    if (req.user?.id !== userId) {
      throw new UnauthorizedException('You can only view your own sessions');
    }

    return this.usersService.getUserSessions(userId);
  }
}
