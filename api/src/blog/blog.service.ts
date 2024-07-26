import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { EncryptionService } from 'src/utils/encryption/encryption.service';

@Injectable()
export class BlogService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createPost(data: CreatePostDto, userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let content = data.content;
    let encryptionKey = null;
    if (data.encrypted) {
      encryptionKey = await this.encryptionService.generateEncryptionKey();
      content = await this.encryptionService.encrypt(
        data.content,
        encryptionKey,
      );
    }

    if (data.categoryId) {
      const category = await this.prismaService.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }
    if (data.tagIds) {
      const tags = await this.prismaService.tag.findMany({
        where: {
          id: {
            in: data.tagIds,
          },
        },
      });
      if (tags.length !== data.tagIds.length) {
        throw new NotFoundException('One or more tags not found');
      }
    }

    return this.prismaService.post.create({
      data: {
        title: data.title,
        content: content,
        slug: data.slug || this.generateSlug(data.title),
        author: {
          connect: { id: userId },
        },
        category: data.categoryId
          ? { connect: { id: data.categoryId } }
          : undefined,
        tags: data.tagIds
          ? { connect: data.tagIds.map((id) => ({ id })) }
          : undefined,
        encryptionKey: encryptionKey,
        encrypted: data.encrypted || false,
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

  async decryptPost(postId: number, key: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.encrypted || !post.encryptionKey) {
      throw new UnauthorizedException(
        'Post is not encrypted or no encryption key found',
      );
    }

    if (key !== post.encryptionKey) {
      throw new UnauthorizedException('Invalid encryption key');
    }

    post.content = await this.encryptionService.decrypt(
      post.content,
      post.encryptionKey,
    );

    return post;
  }

  // private generateSlug(title: string): string {
  //   return title
  //     .toLowerCase()
  //     .replace(/[^a-z0-9]+/g, '-')
  //     .replace(/(^-|-$)+/g, '');
  // }

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
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async getPostBySlug(slug: string) {
    return this.prismaService.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async getPostsByUser(userId: number) {
    return this.prismaService.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async getPostsByCategory(categoryId: number) {
    return this.prismaService.post.findMany({
      where: { categoryId },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }
}
