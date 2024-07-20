import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { GoogleAuthGuard } from './guards/auth-google.guard';
@Controller('auth-google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    const user = await this.authGoogleService.validateOAuthLoginEmail(
      req.user.email,
      'google',
    );
    const accessToken = await this.authGoogleService.loginOAuth(user);
    return { accessToken };
  }
}
