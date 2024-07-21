import { Controller, Req, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGithubService } from './auth-github.service';
import { GitHubAuthGuard } from './guards/auth-github.guard';

@Controller('auth-github')
@ApiTags('Auth')
export class AuthGithubController {
  constructor(private readonly authService: AuthGithubService) {}

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({ summary: 'GitHub OAuth' })
  @ApiResponse({ status: 200, description: 'GitHub OAuth' })
  @ApiBody({ description: 'GitHub OAuth' })
  @ApiBearerAuth()
  async githubAuth(@Req() req) {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  @ApiOperation({ summary: 'GitHub OAuth Callback' })
  @ApiResponse({ status: 200, description: 'GitHub OAuth Callback' })
  @ApiBody({ description: 'GitHub OAuth' })
  async githubAuthRedirect(@Req() req) {
    const user = await this.authService.validateOAuthLoginEmail(
      req.user.email,
      'github',
    );
    const accessToken = await this.authService.loginOAuth(user);
    return { accessToken };
  }
}
