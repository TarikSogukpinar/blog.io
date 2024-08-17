import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/core/request/customRequest';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserSessionDto } from './dto/getSession.dto';

@Controller({ path: 'sessions', version: '1' })
@ApiTags('Sessions')
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user sessions' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  @ApiResponse({
    status: 404,
    description: 'No sessions found for the provided UUID',
  })
  @HttpCode(HttpStatus.OK)
  async getUserSessions(
    @Req() req: CustomRequest,
  ): Promise<GetUserSessionDto[]> {
    const userUuid = req.user?.uuid;

    if (!userUuid) {
      throw new NotFoundException('User UUID is missing');
    }

    return this.sessionsService.getUserSessions(userUuid);
  }
}
