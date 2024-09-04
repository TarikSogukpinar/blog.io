import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SwaggerModule } from './core/swagger/swagger.module';
import { BlogModule } from './blog/blog.module';
import { UuidModule } from './utils/uuid/uuid.module';
import { UsersModule } from './user/user.module';
import { HealthModule } from './core/healthCheck/health.module';
import { SessionsModule } from './sessions/sessions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        const env = process.env.NODE_ENV;
        const envFilePath =
          env === 'production'
            ? '.env.production'
            : env === 'staging'
              ? '.env.staging'
              : '.env.development';
        console.log(`Loading environment variables from ${envFilePath}`);
        return envFilePath;
      })(),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    SwaggerModule,
    BlogModule,
    UuidModule,
    HealthModule,
    UsersModule,
    SessionsModule,
    CategoryModule,
    RedisModule,
    ScheduleModule.forRoot({
      cronJobs: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          pinoHttp: {
            transport:
              configService.get<string>('NODE_ENV') !== 'production'
                ? { target: 'pino-pretty' }
                : undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
