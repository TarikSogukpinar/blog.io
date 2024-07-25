import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

@Module({
  imports: [],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
