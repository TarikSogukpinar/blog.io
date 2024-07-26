import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Get,
  Res,
  UsePipes,
  ValidationPipe,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/database/database.service';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/core/request/customRequest';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('create-post')
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 200, description: 'Create post' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(@Body() data: CreatePostDto, @Req() req: CustomRequest) {
    const userId = req.user?.id;
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
  async getAllPosts() {
    return this.blogService.getAllPosts();
  }

  @Get('post/:id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') id: string) {
    const postId = parseInt(id, 10);
    return this.blogService.getPostById(postId);
  }

  @Get('user-posts/:userId')
  @ApiOperation({ summary: 'Get posts by user ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getPostsByUser(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    return this.blogService.getPostsByUser(id);
  }
}
