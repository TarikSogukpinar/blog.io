import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/database/database.service';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);

  for (let i = 0; i < 10; i++) {
    await prismaService.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
        role: 'USER',
        accountType: faker.helpers.arrayElement(['FREE', 'MEDIUM', 'PREMIUM']),
        githubUrl: faker.internet.url(),
        twitterUrl: faker.internet.url(),
        linkedinUrl: faker.internet.url(),
        isActiveAccount: faker.datatype.boolean(),
        ProfileImage: {
          create: {
            imageUrl: faker.image.avatar(),
          },
        },
        posts: {
          create: [
            {
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraphs(),
              slug: faker.lorem.slug(),
              published: faker.datatype.boolean(),
            },
          ],
        },
      },
    });
  }

  console.log('Seeder tamamlandı.');
  await app.close();
}

bootstrap();
