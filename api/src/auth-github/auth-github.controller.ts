import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGithubService } from './auth-github.service';
import { GitHubAuthGuard } from './guards/auth-github.guard';


@Controller('auth-github')
@ApiTags('Auth')
export class AuthGithubController {
  constructor(private readonly authService: AuthGithubService) {}

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  async githubAuth(@Req() req) {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubAuthRedirect(@Req() req) {
    const user = await this.authService.validateOAuthLoginEmail(
      req.user.email,
      'github',
    );
    const accessToken = await this.authService.loginOAuth(user);
    return { accessToken };
  }
}
