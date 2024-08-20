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

@Controller({ path: 'sessions', version: '1' })
@ApiTags('Sessions')
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: Number })
  @ApiOperation({ summary: 'Get all active sessions for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of active sessions',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  async getUserSessions(@Param('userId') userId: number) {
    return await this.sessionsService.getUserSessions(userId);
  }

  @Delete(':userId/:token')
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
    @Param('userId') userId: number,
    @Param('token') token: string,
  ) {
    const terminatedSession = await this.sessionsService.terminateSession(
      userId,
      token,
    );

    return {
      message: 'Session terminated successfully',
      sessionId: terminatedSession.id,
    };
  }
}
