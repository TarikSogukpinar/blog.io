import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';

@Module({
  imports: [],
  controllers: [],
  providers: [BlogService],
})
export class BlogModule {}
