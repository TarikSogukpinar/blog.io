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
  UnauthorizedException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/core/request/customRequest';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create-post')
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(@Body() data: CreatePostDto, @Req() req: CustomRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    return this.blogService.createPost(data, userId);
  }

  @Put('update-post/:id')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updatePost(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    const postId = parseInt(id, 10);
    return this.blogService.updatePost(postId, data, userId);
  }

  @Delete('delete-post/:id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: string, @Req() req: CustomRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    const postId = parseInt(id, 10);
    return this.blogService.deletePost(postId, userId);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
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

  @Get('post/:id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') id: string) {
    const postId = parseInt(id, 10);
    const post = await this.blogService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  @Get('post/slug/:slug')
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.blogService.getPostBySlug(slug);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  @Get('user-posts/:userId')
  @ApiOperation({ summary: 'Get posts by user ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getPostsByUser(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    return this.blogService.getPostsByUser(id);
  }

  @Get('category/:categoryId/posts')
  @ApiOperation({ summary: 'Get posts by category ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    const id = parseInt(categoryId, 10);
    return this.blogService.getPostsByCategory(id);
  }
}
