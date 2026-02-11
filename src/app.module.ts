import { TestCacheController } from './redis-cache/test-cache.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { AppLoggerService } from './common/logger/logger.service';
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

@Module({
  imports: [
    DatabaseModule,
    // Configuration module to load .env variables
    ConfigModule.forRoot({
      isGlobal: true,
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

    AuthModule,

    TasksModule,

    // Redis cache module with the configs.
    RedisCacheModule,
  ],
  controllers: [TestCacheController, AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    AppLoggerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
