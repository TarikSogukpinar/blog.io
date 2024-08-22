import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { EncryptionService } from 'src/utils/encryption/encryption.service';
import {
  CategoryNotFoundException,
  PostNotFoundException,
  TagNotFoundException,
  UnauthorizedAccessException,
  UserNotFoundException,
} from 'src/core/handler/exceptions/custom-expection';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class BlogService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly uuidService: UuidService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private async generateSlug(title: string): Promise<string> {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createPost(
    data: CreatePostDto,
    userUuid: string,
  ): Promise<{ uuid: string; title: string; slug: string }> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { uuid: userUuid },
      });

      if (!user) throw new UserNotFoundException();

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

        if (!category) throw new CategoryNotFoundException();
      }

      if (data.tagIds) {
        const tags = await this.prismaService.tag.findMany({
          where: {
            id: {
              in: data.tagIds,
            },
          },
        });

        if (tags.length !== data.tagIds.length)
          throw new TagNotFoundException();
      }

      const post = await this.prismaService.post.create({
        data: {
          uuid: this.uuidService.generateUuid(),
          title: data.title,
          content: content,
          slug: data.slug || (await this.generateSlug(data.title)),
          author: {
            connect: { uuid: userUuid }, //Connect to user with UUID
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
        select: {
          uuid: true,
          title: true,
          slug: true,
        },
      });

      return post;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async updatePost(
    postUuid: string,
    data: UpdatePostDto,
    userUuid: string,
  ): Promise<{ message: string }> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { uuid: postUuid },
      });

      if (!post) throw new PostNotFoundException();

      if (post.authorUuid !== userUuid) {
        throw new UnauthorizedAccessException();
      }

      await this.prismaService.post.update({
        where: { uuid: postUuid },
        data: {
          title: data.title,
          content: data.content,
          slug: data.slug || (await this.generateSlug(data.title)),
        },
      });

      return { message: 'Post updated successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async deletePost(postUuid: string, userUuid: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { uuid: postUuid },
      });

      if (!post) {
        throw new PostNotFoundException();
      }

      if (post.authorUuid !== userUuid) {
        throw new UnauthorizedAccessException();
      }

      return this.prismaService.post.delete({
        where: { uuid: postUuid },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async decryptPost(postUuid: string, key: string) {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { uuid: postUuid },
        include: {
          author: true,
          category: true,
          tags: true,
        },
      });

      if (!post) {
        throw new PostNotFoundException();
      }

      if (!post.encrypted || !post.encryptionKey) {
        throw new UnauthorizedAccessException();
      }

      if (key !== post.encryptionKey) {
        throw new UnauthorizedAccessException();
      }

      post.content = await this.encryptionService.decrypt(
        post.content,
        post.encryptionKey,
      );

      return post;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getAllPosts(
    publishedOnly: boolean = true,
    page: number = 1,
    pageSize: number = 10,
  ) {
    try {
      const posts = await this.prismaService.post.findMany({
        where: publishedOnly ? { published: false } : {},
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
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getPostById(postId: number) {
    try {
      return this.prismaService.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          category: true,
          tags: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getPostBySlug(slug: string) {
    try {
      return this.prismaService.post.findUnique({
        where: { slug },
        include: {
          author: true,
          category: true,
          tags: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getPostsByUser(userUuid: string) {
    try {
      return this.prismaService.post.findMany({
        where: { authorUuid: userUuid },
        include: {
          author: true,
          category: true,
          tags: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getPostsByCategory(categoryId: number) {
    try {
      return this.prismaService.post.findMany({
        where: { categoryId },
        include: {
          author: true,
          category: true,
          tags: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
