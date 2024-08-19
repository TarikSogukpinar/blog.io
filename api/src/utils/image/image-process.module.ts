import { Module } from '@nestjs/common';
import { ImageProcessingService } from './image-process.service';

@Module({
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class ImageProcessModule {}
