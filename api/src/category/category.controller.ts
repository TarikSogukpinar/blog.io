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
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: 'category', version: '1' })
@ApiTags('Category')
export class CategoryController {
  constructor() {}

  
}
