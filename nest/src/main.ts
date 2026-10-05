import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  const clientDir = join(process.cwd(), '..', 'react', 'dist');
  if (existsSync(clientDir)) {
    app.useStaticAssets(clientDir);
  }

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
await bootstrap();
