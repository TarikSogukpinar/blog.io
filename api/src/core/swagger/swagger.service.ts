import { Injectable, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Igniter-Web Boilerplate API v.1.0.0')
      .setDescription('Igniter-Web Boilerplate API Documentation')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('Igniter-Fivem')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
}
