import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories() {
    try {
      return await this.prismaService.category.findMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the categories, please try again later',
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

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prismaService.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the category, please try again later',
      );
    }
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      return await this.prismaService.category.update({
        where: { id: categoryId },
        data: updateCategoryDto,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the category, please try again later',
      );
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      return await this.prismaService.category.delete({
        where: { id: categoryId },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the category, please try again later',
      );
    }
  }
}
