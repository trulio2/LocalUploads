import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UploadController } from './upload.controller.js';

@Module({
  imports: [],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
