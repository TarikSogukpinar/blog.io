import { Module } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { TokenModule } from '../core/token/token.module';
import { PrismaModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { HashingModule } from 'src/utils/hashing/hashing.module';
import { AuthGithubController } from './auth-github.controller';
import { AuthGithubService } from './auth-github.service';

@Module({
  imports: [
    PassportModule,
    HashingModule,
    TokenModule,
    PrismaModule,
    HashingModule,
  ],
  controllers: [AuthGithubController],
  providers: [AuthGithubService, PrismaService, AuthGithubService],
  exports: [AuthGithubService],
})
export class AuthGithubModule {}
