import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    try {
      let email = profile.emails?.[0]?.value;

      const githubEmailsUrl =
        this.configService.get<string>('GITHUB_EMAILS_URL');

      if (!email) {
        const response = await firstValueFrom(
          this.httpService.get(githubEmailsUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        );

        const emails = await response.data;
        email = emails.find(
          (email: { primary: boolean }) => email.primary,
        ).email;
      }

      const jwt: string = await this.authService.validateOAuthLogin({
        email,
        provider: profile.provider,
      });
      const user = {
        jwt,
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
