import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateTagDto } from './dto/createTag.dto';
import { TagResponseDto } from './dto/tagResponse.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    try {
      const tag = await this.prisma.tag.create({
        data: createTagDto,
      });

      if (!tag) {
        throw new InternalServerErrorException('Error creating tag');
      }

      
      return {
        name: tag.name,
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating tag');
    }
  }

  async getAllTags() {
    try {
      const tags = await this.prisma.tag.findMany();
      return tags;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching tags');
    }
  }

  async getTagById(id: number) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
      });
      if (!tag) {
        throw new NotFoundException(`Tag with ID ${id} not found`);
      }
      return tag;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching tag');
    }
  }

  async updateTag(id: number, name: string) {
    try {
      const tag = await this.prisma.tag.update({
        where: { id },
        data: { name },
      });
      return tag;
    } catch (error) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  async deleteTag(id: number) {
    try {
      const tag = await this.prisma.tag.delete({
        where: { id },
      });
      return tag;
    } catch (error) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

  //   private toResponseDto(tag:string): TagResponseDto {
  //     return {
  //       id: tag.id,
  //       name: tag.name,
  //       createdAt: tag.createdAt,
  //       updatedAt: tag.updatedAt,
  //     };
  //   }
}
