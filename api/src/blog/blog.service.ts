import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
  getHello(): string {
    return 'Hello World!';
  }
}
