import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { UploadService } from './upload.service';

/**
 * UploadController
 *
 * @description
 * Handles file uploads
 *
 * @example
 * curl -X POST \
 *   http://localhost:3000/upload/images/profile \
 *   -H 'Content-Type: multipart/form-data' \
 *   -d '{"file": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQIHWP4DwABAQEAgMnIyAAAAAElFTkSuQmCC"}'
 */
@Controller('upload')
export class UploadController {
  /**
   * Constructor
   *
   * @param {UploadService} uploadService
   */
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Handle file upload
   *
   * @param {Express.Multer.File} file
   * @param {string} folder
   * @param {string} subFolder
   *
   * @returns {Promise<any>}
   */
  @Post('/:folder/:subFolder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _, callback) => {
          const { folder, subFolder } = req.params;
          const path = `./uploads/${folder}/${subFolder}`;

          if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
          }

          callback(null, path);
        },
        filename: (_, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
    @Param('subFolder') subFolder: string
  ) {
    return this.uploadService.handleFile(file);
  }
}

