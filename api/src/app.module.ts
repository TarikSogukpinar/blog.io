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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_HOST'),
        keepAlive: 1000,
        socketTimeout: 1000,
        lazyConnect: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
