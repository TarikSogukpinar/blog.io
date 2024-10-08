import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/database.service';
import { CreateTagDto } from './dto/createTag.dto';
import { TagResponseDto } from './dto/tagResponse.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { DeleteTagDto } from './dto/deleteTag.dto';
import { GetTagByIdDto } from './dto/getTagById.dto';
import {
  TagNotCreatedException,
  TagNotFoundException,
} from 'src/core/handler/exceptions/custom-expection';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    try {
      const createTag = await this.prisma.tag.create({
        data: createTagDto,
      });

      if (!createTag) throw new TagNotCreatedException();

      return {
        name: createTag.name,
        id: createTag.id,
        createdAt: createTag.createdAt,
        updatedAt: createTag.updatedAt,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getAllTags(): Promise<TagResponseDto[]> {
    try {
      const getAllTags = await this.prisma.tag.findMany();

      if (!getAllTags) throw new TagNotFoundException();

      return getAllTags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }));
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async getTagById(getTagById: GetTagByIdDto): Promise<TagResponseDto> {
    try {
      const tags = await this.prisma.tag.findUnique({
        where: { id: getTagById.id },
      });

      if (!tags) throw new TagNotFoundException();

      return tags;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async updateTag(updateTagDto: UpdateTagDto): Promise<TagResponseDto> {
    try {
      const updatedTag = await this.prisma.tag.update({
        where: { id: updateTagDto.id },
        data: { name: updateTagDto.name },
      });

      if (!updatedTag) throw new TagNotFoundException();

      return updatedTag;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async deleteTag(deleteTagDto: DeleteTagDto): Promise<TagResponseDto> {
    try {
      const deletedTag = await this.prisma.tag.delete({
        where: { id: deleteTagDto.id },
      });

      if (!deletedTag) throw new TagNotFoundException();

      return deletedTag;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }
}
