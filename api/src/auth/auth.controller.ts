import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth.guard';
import { CustomRequest } from '../core/request/customRequest';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LogoutDto } from './dto/logout.dto';
import { ErrorCodes } from 'src/core/handler/error/error-codes';
import { AuthGuard } from '@nestjs/passport';
// import { GoogleAuthGuard } from '../auth-google/guards/auth-google.guard';
// import { GitHubAuthGuard } from '../auth-github/guards/auth-github.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @ApiOperation({ summary: 'Github login' })
  @ApiResponse({ status: 200, description: 'Github login' })
  @ApiBody({ type: RegisterUserDto })
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    // GitHub ile oturum açma başlatılıyor
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'Github login callback' })
  @ApiResponse({ status: 200, description: 'Github login callback' })
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res) {
    const jwt = req.user.jwt;
    console.log(jwt, 'jwt datası');
    return res.redirect(`http://127.0.0.1:3000/en/login?JWT=${jwt}`);
  }

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({ status: 200, description: 'Successful register' })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const result = await this.authService.registerUserService(registerUserDto);
    return {
      message: 'Successfully register user!',
      result,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiBody({ type: LoginUserDto })
  @ApiTags('Auth')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authService.loginUserService(loginUserDto);
    return {
      message: 'Successfully login user!',
      result,
    };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, description: 'Successful logout' })
  @ApiBody({ type: LogoutDto })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: CustomRequest) {
    const userId = req.user?.id;
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!userId || !token) {
      throw new UnauthorizedException(ErrorCodes.InvalidCredentials);
    }

    await this.authService.logoutUserService(userId, token);
    return { message: 'Logout successful' };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Refresh access token' })
  @ApiBody({ type: String })
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshTokenService(refreshToken);
    return { message: 'Token refreshed', result };
  }
}
