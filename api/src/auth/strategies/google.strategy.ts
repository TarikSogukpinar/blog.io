import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const email = emails[0].value;
    const firstName = name.givenName;
    const lastName = name.familyName;

    const user = await this.authService.validateOAuthLoginEmail(
      email,
      'google',
    );

    const jwtPayload = {
      user: {
        email: user.email,
        firstName,
        lastName,
        accessToken,
      },
      accessToken,
    };

    done(null, jwtPayload);
  }
}
