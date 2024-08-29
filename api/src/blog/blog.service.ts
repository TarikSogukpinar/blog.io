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
  UUIDCannotBeNotEmptyException,
} from 'src/core/handler/exceptions/custom-expection';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { CreatePostResponseDto } from './dto/createPostResponse.dto';
import { UpdatePostResponseDto } from './dto/updatePostResponse.dto';
import { DeletePostResponseDto } from './dto/deletePostResponse.dto';
import { GetPostByUuidResponseDto } from './dto/getPostByUuidResponse.dto';
import { GetPostBySlugResponseDto } from './dto/getPostBySlugResponse.dto';
import { GetPostByUserResponseDto } from './dto/getPostsByUser.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly uuidService: UuidService,
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
  ): Promise<CreatePostResponseDto> {
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
  ): Promise<UpdatePostResponseDto> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { uuid: postUuid },
      });

      if (!post) throw new PostNotFoundException();

      if (post.authorUuid !== userUuid) throw new UnauthorizedAccessException();

      const updatedPost = await this.prismaService.post.update({
        where: { uuid: postUuid },
        data: {
          title: data.title,
          content: data.content,
          slug: data.slug || (await this.generateSlug(data.title)),
        },
      });

      return {
        uuid: updatedPost.uuid,
        title: updatedPost.title,
        slug: updatedPost.slug,
        content: updatedPost.content,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async deletePost(
    postUuid: string,
    userUuid: string,
  ): Promise<DeletePostResponseDto> {
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

      await this.prismaService.post.delete({
        where: { uuid: postUuid },
      });

      return {
        postUuid: postUuid,
        userUuid: userUuid,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async decryptPost(postUuid: string, key: string): Promise<any> {
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

      const decryptedContent = await this.encryptionService.decrypt(
        post.content,
        post.encryptionKey,
      );

      const updatedPost = await this.prismaService.post.update({
        where: { uuid: postUuid },
        data: {
          content: decryptedContent,
          encrypted: false,
        },
      });

      return updatedPost;
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

  async getPostByUuid(postUuid: string): Promise<GetPostByUuidResponseDto> {
    try {
      if (!postUuid) {
        throw new PostNotFoundException();
      }

      const post = await this.prismaService.post.findUnique({
        where: { uuid: postUuid },
        select: {
          uuid: true,
          slug: true,
          title: true,
          content: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          encrypted: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!post) {
        throw new PostNotFoundException();
      }

      return post;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getPostBySlug(slug: string): Promise<GetPostBySlugResponseDto> {
    try {
      if (!slug) {
        throw new PostNotFoundException();
      }
      const result = this.prismaService.post.findUnique({
        where: { slug },
        include: {
          author: false,
          category: true,
          tags: true,
        },
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getPostsByUser(userUuid: string): Promise<GetPostByUserResponseDto[]> {
    try {
      if (!userUuid) throw new UUIDCannotBeNotEmptyException();

      const posts = await this.prismaService.post.findMany({
        where: { authorUuid: userUuid },
        select: {
          uuid: true,
          slug: true,
          title: true,
          content: true,
          published: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!posts || posts.length === 0) throw new PostNotFoundException();

      return posts;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
