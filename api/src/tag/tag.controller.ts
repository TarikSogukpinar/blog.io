import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  Post,
  Put,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/createTag.dto';
import { CustomRequest } from 'src/core/request/customRequest';

@Controller({ path: 'tag', version: '1' })
@ApiTags('Tag')
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create-tag')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: String })
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag created successfully',
  })
  @HttpCode(HttpStatus.OK)
  async createTag(@Body() data: CreateTagDto, @Req() req: CustomRequest) {
    const result = await this.tagService.createTag(data);
    return {
      message: 'List of active user sessions',
      result,
    };
  }

  @Put(':tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: String })
  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully',
  })
  async updateTag() {}

  @Delete(':tagId')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: String })
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  async deleteTag() {}
}
