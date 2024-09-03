import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/role.guard';
import { Role } from '@prisma/client';
import { CustomRequest } from 'src/core/request/customRequest';
import { UserNotFoundException } from 'src/core/handler/exceptions/custom-expection';

@Controller({ path: 'sessions', version: '1' })
@ApiTags('Sessions')
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: String })
  @ApiOperation({ summary: 'Get all active sessions for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of active user sessions',
  })
  @HttpCode(HttpStatus.OK)
  async getUserSessions(@Req() req: CustomRequest) {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
      throw new UserNotFoundException();
    }

    const result = await this.sessionsService.getUserSessions(userUuid);
    return {
      message: 'List of active user sessions',
      result,
    };
  }

  @Delete(':userUuid/:token')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: Number })
  @ApiOperation({ summary: 'Terminate a session for a user' })
  @ApiResponse({
    status: 200,
    description: 'Session terminated successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  async terminateUserSession(
    @Param('userUuid') userUuid: string,
    @Param('token') token: string,
  ) {
    const result = await this.sessionsService.terminateSession(userUuid, token);

    return {
      message: 'Session terminated successfully',
      sessionId: result,
    };
  }
}
