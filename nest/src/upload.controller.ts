import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const uploadDir = join(process.cwd(), '..', 'uploads');
mkdirSync(uploadDir, { recursive: true });

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          const safe = basename(file.originalname).replace(/[^\w.\- ]/g, '_');
          cb(null, `${Date.now()}-${safe}`);
        },
      }),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return { files: files.map((file) => file.filename) };
  }
}
