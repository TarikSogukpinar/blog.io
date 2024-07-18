import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { username, emails } = profile;
    const email = emails[0].value;

    const user = await this.authService.validateOAuthLoginEmail(
      email,
      'github',
    );

    const jwtPayload = {
      user: {
        email: user.email,
        username,
        accessToken,
      },
      accessToken,
    };

    done(null, jwtPayload);
  }
}
