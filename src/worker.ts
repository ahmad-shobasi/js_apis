import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule);
}

bootstrap();
