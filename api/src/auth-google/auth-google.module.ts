import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../database/database.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthGoogleController } from './auth-google.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    PrismaModule,
  ],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, GoogleStrategy],
})
export class AuthModule {}
