import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AppLoggerService } from './logger.service';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, ip } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - start;
          this.logger.log({
            type: 'REQUEST',
            method,
            url: originalUrl,
            ip,
            responseTime: `${responseTime}ms`,
            userId: request.user?.id ?? null,
          });
        },
        error: (err) => {
          const responseTime = Date.now() - start;

          this.logger.error({
            type: 'REQUEST_ERROR',
            method,
            url: originalUrl,
            ip,
            responseTime: `${responseTime}ms`,
            error: err.message,
            userId: request.user?.id ?? null,
          });
        },
      }),
    );
  }
}
