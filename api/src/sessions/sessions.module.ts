import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { PrismaService } from 'src/database/database.service'; // Eğer Prisma kullanıyorsanız
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 100,
    }),
    PrismaModule,
  ],
  providers: [SessionsService, PrismaService],
  controllers: [SessionsController],
})
export class SessionsModule {}
