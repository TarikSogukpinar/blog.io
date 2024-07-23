//Custom Modules, Packages, Configs, etc.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//pnpm packages
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { SwaggerService } from './core/swagger/swagger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(
    configService.get<string>('API_GLOBAL_PREFIX', { infer: true }),
  );
  app.enableShutdownHooks();
  app.use(helmet());
  app.use(hpp());
  app.use(compression());
  app.use(cookieParser());

  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);
  const PORT = configService.get<string>('API_PORT', { infer: true });

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://blog.tariksogukpinar.dev',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  });

  await app.listen(PORT, '0.0.0.0');
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/`);
}
bootstrap();
