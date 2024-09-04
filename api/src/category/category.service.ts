import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryResponseDto } from './dto/categoryResponse.dto';
import { CreateCategoryResponseDto } from './dto/createCategoryResponse.dto';
import { UpdateCategoryResponseDto } from './dto/updateCategoryResponse.dto';
import { DeleteCategoryDto } from './dto/deleteCategory.dto';
import { DeleteCategoryResponseDto } from './dto/deleteCategoryResponse.dto';
import { RedisService } from 'src/core/cache/cache.service';
import {
  CategoryAlreadyExistsException,
  CategoryNotCreatedException,
  CategoryNotDeletedException,
  CategoryNotFoundException,
  CategoryNotUpdatedException,
} from 'src/core/handler/exceptions/custom-expection';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    try {
      const cacheKey = 'categories';

      const cachedCategories = await this.redisService.getValue(cacheKey);

      if (cachedCategories) {
        return JSON.parse(cachedCategories);
      }

      const categories = await this.prismaService.category.findMany();

      if (!categories || categories.length === 0)
        throw new CategoryNotFoundException();

      const categoryResponse: CategoryResponseDto[] = categories.map(
        (category) => ({
          id: category.id,
          name: category.name,
        }),
      );

      await this.redisService.setValue(
        cacheKey,
        JSON.stringify(categoryResponse),
        3600,
      );

      return categoryResponse;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the categories, please try again later',
      );
    }
  }

  //refactor this method
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

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    try {
      const category = await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });

      if (!category) throw new CategoryNotCreatedException();

      return category;
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
  ): Promise<UpdateCategoryResponseDto> {
    try {
      const existingCategory = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) throw new CategoryNotFoundException();

      if (updateCategoryDto.name) {
        const duplicateCategory = await this.prismaService.category.findFirst({
          where: {
            name: updateCategoryDto.name,
            id: { not: categoryId },
          },
        });

        if (duplicateCategory) throw new CategoryAlreadyExistsException();
      }

      const updatedCategory = await this.prismaService.category.update({
        where: { id: categoryId },
        data: updateCategoryDto,
      });

      if (!updatedCategory) throw new CategoryNotUpdatedException();

      return updatedCategory as UpdateCategoryResponseDto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the category, please try again later',
      );
    }
  }

  async deleteCategory(
    deleteCategoryDto: DeleteCategoryDto,
  ): Promise<DeleteCategoryResponseDto> {
    try {
      const existingCategory = await this.prismaService.category.findUnique({
        where: { id: deleteCategoryDto.id },
      });

      if (!existingCategory) throw new CategoryNotFoundException();

      const relatedPosts = await this.prismaService.post.findMany({
        where: { id: deleteCategoryDto.id },
      });

      if (relatedPosts.length > 0) throw new CategoryNotDeletedException();

      const deletedCategory = await this.prismaService.category.delete({
        where: { id: deleteCategoryDto.id },
      });

      return {
        id: deletedCategory.id,
        name: deletedCategory.name,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the category, please try again later',
      );
    }
  }
}
