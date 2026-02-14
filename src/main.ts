import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { apiReference } from '@scalar/nestjs-api-reference';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { AppLoggerService } from './common/logger/logger.service';
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const appConfig = app.get(ConfigService);

  // configure swagger UI.
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(
    '/reference',
    apiReference({
      content: documentFactory,
    }),
  );
  //
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['https://frontend.com', 'https://another-frontend.com'], // Allowed origins
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

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
