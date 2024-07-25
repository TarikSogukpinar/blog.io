import { Injectable, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Blog.io Boilerplate API v.1.0.0')
      .setDescription('Blog.io Boilerplate API Documentation')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('Blog.io')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
}
