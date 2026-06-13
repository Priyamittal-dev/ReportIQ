import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID', 'mock_google_client_id'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET', 'mock_google_client_secret'),
      callbackURL: config.get('GOOGLE_CALLBACK_URL', 'http://localhost:4000/api/auth/google/callback'),
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/analytics.readonly'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      id: profile.id,
      emails,
      displayName: `${name.givenName} ${name.familyName}`,
      photos,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
