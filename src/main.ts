import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { apiReference } from '@scalar/nestjs-api-reference';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { AppLoggerService } from './common/logger/logger.service';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { MAIL_QUEUE } from './mail/mail.constant';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const appConfig = app.get(ConfigService);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  // Get queue instance from NestJS's dependency injection container.
  const mailQueue = app.get<Queue>(getQueueToken(MAIL_QUEUE));

  // Set up Bull Board with the queue and server adapter.
  createBullBoard({
    queues: [new BullMQAdapter(mailQueue)],
    serverAdapter,
  });

  // configure swagger UI.
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();

  // Use static folder path for uploaded images
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['https://frontend.com', 'https://another-frontend.com'], // Allowed origins
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // NOTE: Only enable API docs and Bull Board in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    app.use('/admin/queues', serverAdapter.getRouter());
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documentFactory);

    app.use(
      '/reference',
      apiReference({
        content: documentFactory,
      }),
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  app.useGlobalInterceptors(new HttpLoggingInterceptor(app.get(AppLoggerService)));

  await app.listen(appConfig.get<number>('PORT') || 4000);
}
bootstrap();
