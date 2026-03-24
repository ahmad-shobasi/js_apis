import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { AppLoggerService } from './common/logger/logger.service';
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import appConfig from './config/app.config';
import { envValidation } from './config/env.validation';
import { UserProfileModule } from './user-profile/user-profile.module';
import { QueueModule } from './queue/queue.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    DatabaseModule,

    AuthModule,

    TasksModule,

    // Redis cache module with the configs.
    RedisCacheModule,

    UserProfileModule,

    // Queue module for background jobs.
    QueueModule,

    // Registering jobs modules.
    MailModule,

    // Configuration module to load .env variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [appConfig],
      validationSchema: envValidation,
    }),

    // Configure rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    AppLoggerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
