import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaModule } from 'src/database/database.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
