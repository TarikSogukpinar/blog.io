import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ImageProcessingService } from '../image/image-process.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private readonly maxFileSize = 2 * 1024 * 1024;

  async uploadProfileImage(
    file: Express.Multer.File,
    userUuid: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only image files are allowed.',
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File is too large. Maximum size is 2 MB.');
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFileName = `${userUuid}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    const resizedBuffer = await this.imageProcessingService.resizeImage(
      file.buffer,
      256,
      256,
    );
    await this.imageProcessingService.saveImage(resizedBuffer, filePath);

    return `/uploads/profiles/${uniqueFileName}`;
  }
}
