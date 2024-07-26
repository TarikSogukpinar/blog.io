import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: CreatePostDto, userId: number) {
    return this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        author: {
          connect: { id: userId },
        },
      },
    });
  }

  async updatePost(postId: number, data: UpdatePostDto, userId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException('You are not the author of this post');
    }

    return this.prismaService.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        content: data.content,
      },
    });
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException('You are not the author of this post');
    }

    return this.prismaService.post.delete({
      where: { id: postId },
    });
  }

  async getAllPosts(
    publishedOnly: boolean = true,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const posts = await this.prismaService.post.findMany({
      where: publishedOnly ? { published: true } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPosts = await this.prismaService.post.count({
      where: publishedOnly ? { published: true } : {},
    });

    return {
      data: posts,
      meta: {
        totalPosts,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
    };
  }

  async getPostById(postId: number) {
    return this.prismaService.post.findUnique({
      where: { id: postId },
    });
  }

  async getPostsByUser(userId: number) {
    return this.prismaService.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
      },
    });
  }
}
