import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

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
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('category/:categoryId/posts')
  @ApiOperation({ summary: 'Get posts by category ID' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    const id = parseInt(categoryId, 10);
    return this.categoryService.getPostsByCategory(id);
  }

  @Post('createCategory')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @UseGuards(JwtAuthGuard)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(parseInt(id, 10));
  }
}
