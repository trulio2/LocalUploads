import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'node:fs';
import { networkInterfaces, type NetworkInterfaceInfo } from 'node:os';
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

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');

  const lan = Object.values(networkInterfaces())
    .flat()
    .filter(
      (net): net is NetworkInterfaceInfo =>
        !!net && net.family === 'IPv4' && !net.internal,
    )
    .map((net) => `http://${net.address}:${port}`);
  Logger.log(`On your network: ${lan.join(', ') || 'unavailable'}`, 'Bootstrap');
}
await bootstrap();
