import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/core/request/customRequest';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNotFoundException } from 'src/core/handler/exceptions/custom-expection';

@Controller({ path: 'blog', version: '1' })
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create-post')
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async createPost(@Body() data: CreatePostDto, @Req() req: CustomRequest) {
    const userUuid = req.user?.uuid;

    if (!userUuid) throw new UserNotFoundException();

    const result = await this.blogService.createPost(data, userUuid);

    return {
      message: 'Post created successfully',
      result,
    };
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updatePost(
    @Param('uuid') uuid: string,
    @Body() data: UpdatePostDto,
    @Req() req: CustomRequest,
  ) {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
      throw new UserNotFoundException();
    }
    const result = await this.blogService.updatePost(uuid, data, userUuid);

    return {
      message: 'Post updated successfully',
      result,
    };
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('uuid') uuid: string, @Req() req: CustomRequest) {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
      throw new UserNotFoundException();
    }
    const result = await this.blogService.deletePost(uuid, userUuid);

    return {
      message: 'Post deleted successfully',
      result,
    };
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  async getAllPosts(
    @Query('publishedOnly') publishedOnly: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const published = publishedOnly === 'false' ? false : true;
    const pageNum = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;
    return this.blogService.getAllPosts(published, pageNum, size);
  }

  @Get('post/:uuid')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @UseGuards(JwtAuthGuard)
  async getPostByUuid(@Param('uuid') uuid: string, @Req() req: CustomRequest) {
    const result = await this.blogService.getPostByUuid(uuid);

    return { result, message: 'Post retrieved successfully' };
  }

  @Get('decrypt-post/:uuid')
  @ApiOperation({ summary: 'Decrypt post by ID' })
  @ApiResponse({ status: 200, description: 'Post decrypted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Invalid encryption key' })
  @UseGuards(JwtAuthGuard)
  async decryptPost(@Param('uuid') uuid: string, @Query('key') key: string) {
    const result = await this.blogService.decryptPost(uuid, key);

    return { result, message: 'Post decrypted successfully' };
  }

  @Get('post/slug/:slug')
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @UseGuards(JwtAuthGuard)
  async getPostBySlug(@Param('slug') slug: string) {
    const result = await this.blogService.getPostBySlug(slug);

    return { result, message: 'Post retrieved successfully' };
  }

  @Get('user-posts/:uuid')
  @ApiOperation({ summary: 'Get posts by user ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  async getPostsByUser(@Param('uuid') userUuid: string) {
    return this.blogService.getPostsByUser(userUuid);
  }

  @Get('category/:categoryId/posts')
  @ApiOperation({ summary: 'Get posts by category ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    const id = parseInt(categoryId, 10);
    return this.blogService.getPostsByCategory(id);
  }
}
