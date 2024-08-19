import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageProcessingService {
  async resizeImage(
    buffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    return sharp(buffer).resize(width, height).toBuffer();
  }

  async saveImage(buffer: Buffer, filePath: string): Promise<void> {
    await sharp(buffer).toFile(filePath);
  }
}
