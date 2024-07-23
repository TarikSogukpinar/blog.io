import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { AuthService } from '../auth.service';
import axios from 'axios';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
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

      if (!email) {
        // Eğer email döndürülmezse, GitHub API'sinden email adresini alın
        const response = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        });

        console.log(response.data, 'response.data.email');

        const emails = response.data;
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
