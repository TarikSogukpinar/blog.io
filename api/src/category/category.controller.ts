import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { DeleteCategoryDto } from './dto/deleteCategory.dto';
import { DeleteCategoryResponseDto } from './dto/deleteCategoryResponse.dto';

@Controller({ path: 'category', version: '1' })
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('getAllCategories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllCategories() {
    const result = await this.categoryService.getAllCategories();
    return { message: 'Categories retrieved successfully', result };
  }

  @Get('category/:categoryId/posts')
  @ApiOperation({ summary: 'Get posts by category ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    const id = parseInt(categoryId, 10);
    return this.categoryService.getPostsByCategory(id);
  }

  @Post('createCategory')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryService.createCategory(createCategoryDto);
    return { message: 'Category created successfully', result };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(
      parseInt(id, 10),
      updateCategoryDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    type: DeleteCategoryDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteCategory(
    @Param('id') id: string,
    @Body() deleteCategoryDto: DeleteCategoryDto,
  ): Promise<any> {
    const result = await this.categoryService.deleteCategory(deleteCategoryDto);
    return {
      message: 'Category deleted successfully',
      result,
    };
  }
}
